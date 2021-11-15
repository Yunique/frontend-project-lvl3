import * as yup from 'yup';
import i18n from 'i18next';
import _ from 'lodash';
import ru from './locales/ru.js';
import getWatchedState from './watchedState.js';
import { loadFeed, loadPosts } from './loadContent.js';

const updatePosts = (watchedState) => {
  const requestsTimeout = 5000;
  setTimeout(() => {
    loadPosts(watchedState).finally(() => updatePosts(watchedState));
  }, requestsTimeout);
};

const validate = (url, links) => {
  const shema = yup.string().url().required().notOneOf(links);
  shema.validateSync(url);
};

const detectErrorType = (error) => {
  if (error.isParsingError) {
    return 'invalidRss';
  }
  if (error.isAxiosError) {
    return 'connection';
  }
  return 'unknown';
};

export default () => {
  const elements = {
    feedbackContainer: document.querySelector('.feedback-container'),
    rssForm: document.querySelector('.rss-form'),
    urlInput: document.querySelector('input[aria-label="url"]'),
    rssBtn: document.querySelector('button[aria-label="add"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalContainer: document.querySelector('.modal'),
  };

  const state = {
    modal: {
      modalPostId: null,
    },
    feeds: [],
    posts: {
      postsList: [],
      postsReadList: new Set(),
    },
    rssForm: {
      error: null,
      state: 'filling',
      url: '',
    },
  };

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

  const watchedState = getWatchedState(elements, state, i18nextInstance);

  elements.rssForm.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url').trim();

    try {
      validate(currentUrl, state.feeds.map((item) => item.url));
      watchedState.rssForm.error = null;
    } catch (error) {
      watchedState.rssForm.error = error.message;
      watchedState.rssForm.state = 'error';
      return;
    }
    watchedState.rssForm.url = currentUrl;
    watchedState.rssForm.state = 'loading';

    loadFeed(currentUrl)
      .then(({ feed, posts }) => {
        const feedId = _.uniqueId();
        const newFeedWithId = {
          ...feed,
          id: feedId,
          url: currentUrl,
        };

        const newPostsWithId = posts.map((post) => ({
          ...post,
          id: _.uniqueId(),
          feedId,
        }));

        watchedState.feeds.push(newFeedWithId);
        watchedState.posts.postsList.push(...newPostsWithId);
        watchedState.rssForm.state = 'completed';
      })
      .catch((error) => {
        watchedState.rssForm.error = detectErrorType(error);
        watchedState.rssForm.state = 'error';
      });
  });
  updatePosts(watchedState);

  elements.postsContainer.addEventListener('click', (e) => {
    const { target } = e;
    const btnId = target.dataset.id;
    if (btnId) {
      watchedState.modal.modalPostId = btnId;
      watchedState.posts.postsReadList.add(btnId);
    }
  });
};
