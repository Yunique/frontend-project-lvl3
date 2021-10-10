import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import ru from './locales/ru.js';
import { render, renderError } from './view.js';
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

  const form = document.createElement('form');
  const input = document.createElement('input');
  input.name = 'input';
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = i18nextInstance.t('submitButton');

  const feeds = document.createElement('div');
  feeds.setAttribute('name', 'feeds');
  const feedsHeader = document.createElement('H1');
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

  const state = {
    form: {
      fields: {
        url: '',
        feeds: [],
        posts: [],
      },
    },
  };

  const watchedState = onChange(state, (_path, value) => {
    if (state.form.fields.feeds.includes(value)) {
      renderError(i18nextInstance.t('duplicate'), input);
    } else {
      axios(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`)
        .then((response) => {
          if (response.status === 200) {
            const data = parser(response.data);
            const feedId = ID();
            data.feed.id = feedId;
            state.form.fields.feeds.push(data.feed);
            const postsList = [];
            data.posts.forEach((post) => {
              postsList.push({
                id: ID(),
                feedId,
                post,
              });
            });
            state.form.fields.posts.push(postsList);
            return render(state);
          }
          throw new Error('Network response was not ok.');
        }).catch((err) => {
          renderError(err.message, input);
        });
      render(state);
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
};
