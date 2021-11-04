import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import ru from './locales/ru.js';
import {
  renderFeeds,
  renderPosts,
  renderFeedback,
  changeFormRenderState,
} from './view.js';
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
  const watchedState = getWatchedState(elements, state, i18nextInstance);

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
