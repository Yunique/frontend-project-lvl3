import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/ru.js';
import { renderFeeds, renderPosts, renderError } from './view.js';
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

  document.body.innerHTML = `<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modal" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>`;
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  input.name = 'input';
  const button = document.querySelector('button');
  button.textContent = i18nextInstance.t('submitButton');

  const feeds = document.querySelector('div');
  const feedsHeader = document.querySelector('H1');
  feedsHeader.innerHTML = i18nextInstance.t('feeds');
  const feedsUl = document.createElement('ul');

  const posts = document.createElement('div');
  posts.setAttribute('name', 'posts');
  const postsHeader = document.createElement('H1');
  postsHeader.innerHTML = i18nextInstance.t('posts');
  const postsUl = document.createElement('ul');

  feeds.append(feedsHeader, feedsUl);
  posts.append(postsHeader, postsUl);
  form.append(button, input);
  document.body.append(form, feeds, posts);

  const errorHandler = (err) => {
    console.log(err);
    if (err.message === 'Network Error') {
      renderError('Network is not ok.', input);
    } else {
      renderError(err.message, input);
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
          renderError(i18nextInstance.t('duplicate'), input);
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
                renderFeeds(state);
                renderPosts(state);
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
    const formData = new FormData(form);
    const inputValue = formData.get('input');
    schema.validate(inputValue).then((value) => {
      watchedState.form.fields.url = value.trim();
      input.value = '';
      input.focus();
    }).catch((err) => {
      renderError(err.errors, input);
    });
  });

  setTimeout(function checker() {
    state.form.fields.feeds.forEach((feed) => {
      watchedState.form.fields.checkFeed = feed;
    });
    setTimeout(checker, 5000);
  }, 5000);
};
