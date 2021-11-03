import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/ru.js';
import { renderFeeds, renderPosts, renderFeedback, changeFormRenderState } from './view.js';
import parser from './utils/parser.js';

const ID = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  yup.setLocale({
    mixed: {
      required: i18nextInstance.t('required'),
    },
    string: {
      default: i18nextInstance.t('string'),
      url: i18nextInstance.t('url'),
    },
  });

  const schema = yup.string().required().url();

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');
  const feedbackElement = document.querySelector('.feedback-container');

  const errorHandler = (err) => {
    changeFormRenderState(form);
    if (err.message === 'Network Error') {
      renderFeedback(feedbackElement, 'error', 'Ошибка сети');
    } else if (err.message === 'Parse Error') {
      renderFeedback(feedbackElement, 'error', 'Ресурс не содержит валидный RSS');
    } else {
      renderFeedback(feedbackElement, 'error', err.message);
    }
  };

  const state = {
    form: {
      fields: {
        checkFeed: {},
        url: '',
        feeds: [],
        posts: [],
      },
    },
    uiState: {},
  };
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case ('form.fields.url'): {
        const currentFeedsList = state.form.fields.feeds.map((feed) => feed.link);
        if (currentFeedsList.includes(value)) {
          renderFeedback(feedbackElement, 'error', i18nextInstance.t('duplicate'));
          changeFormRenderState(form);
        } else {
          axios(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`)
            .then((response) => {
              if (response.status === 200) {
                const data = parser(response.data);
                const feedId = ID();
                data.feed.id = feedId;
                data.feed.link = value;
                state.form.fields.feeds.push(data.feed);

                const postsWithId = [];
                data.posts.forEach((post) => {
                  const postId = ID();
                  postsWithId.push({
                    id: postId,
                    postInner: post,
                  });
                  state.uiState[postId] = { seen: false };
                });
                state.form.fields.posts.push({ feedId, postsWithId });
                renderFeedback(feedbackElement, 'success', i18nextInstance.t('success'));
                renderFeeds(state);
                renderPosts(state);
                changeFormRenderState(form);
                state.form.fields.url = '';
              }
            }).catch(errorHandler);
        }
        break;
      }
      case ('form.fields.checkFeed'): {
        axios(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value.link)}`)
          .then((response) => {
            if (response.status === 200) {
              const data = parser(response.data);
              const currentPostsIndex = state.form.fields.posts.findIndex(
                (unfilteredPost) => unfilteredPost.feedId === value.id,
              );

              const currentFeedPostsList = state.form.fields.posts[currentPostsIndex].postsWithId
                .map((postUnit) => postUnit.postInner);

              const newPosts = _.differenceWith(data.posts, currentFeedPostsList, _.isEqual);

              if (newPosts.length > 0) {
                const newPostsWithId = [];
                newPosts.forEach((post) => {
                  const postId = ID();
                  newPostsWithId.push({
                    id: postId,
                    postInner: post,
                  });
                  state.uiState[postId] = { seen: false };
                });
                state.form.fields.posts[currentPostsIndex].postsWithId.unshift(...newPostsWithId);
                renderPosts(state);
              }
            }
          }).catch(errorHandler);
        state.form.fields.checkFeed = null;
        break;
      }

      default:
        break;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    changeFormRenderState(form);
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url').trim();
    schema.validate(currentUrl).then((value) => {
      watchedState.form.fields.url = value;
      input.value = '';
      input.focus();
    }).catch((err) => {
      renderFeedback(feedbackElement, 'error', err.errors);
    });
  });

  setTimeout(function checker() {
    state.form.fields.feeds.forEach((feed) => {
      watchedState.form.fields.checkFeed = feed;
    });
    setTimeout(checker, 5000);
  }, 5000);
};
