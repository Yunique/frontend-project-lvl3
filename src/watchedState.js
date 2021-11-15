import onChange from 'on-change';
import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';
import renderModal from './renders/renderModal.js';
import renderFeedback from './renders/renderFeedback.js';
import renderForm from './renders/renderForm.js';

export default (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, currentValue) => {
    if (path === 'rssForm.state') {
      if (currentValue === 'completed' || currentValue === 'error') {
        renderFeedback(elements, state, i18nInstance);
      }
      renderForm(elements, state);
    }

    if (path === 'feeds') {
      renderFeeds(state, elements, i18nInstance);
    }

    if (path === 'posts.postsList' || path === 'posts.postsReadList') {
      renderPosts(state, elements, i18nInstance);
    }

    if (path === 'modal.modalPostId') {
      renderModal(state, elements);
    }
  });

  return watchedState;
};
