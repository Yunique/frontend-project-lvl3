// input.setAttribute('placeholder', 'ссылка RSS');
// input.setAttribute('autocomplete', 'off');
// input.setAttribute('aria-label', 'url');
// input.setAttribute('required', 'true');
// input.setAttribute('autofocus', 'true');

const removeInvalidFeedbackIfExists = () => {
  const input = document.querySelector('input');
  if (input.classList.contains('is-invalid')) {
    const feedback = document.querySelector('.invalid-feedback');
    input.classList.remove('is-invalid');
    feedback.remove();
  }
};

export const renderFeeds = (state) => {
  removeInvalidFeedbackIfExists();

  const feeds = document.querySelector('.feeds');
  const newFeedsUl = document.createElement('ul');
  state.form.fields.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const title = document.createElement('H3');
    title.innerHTML = feed.title;
    const description = document.createElement('p');
    description.innerHTML = feed.description;
    li.append(title, description);
    newFeedsUl.append(li);
  });
  feeds.replaceChildren(newFeedsUl);
};

export const renderPosts = (state) => {
  removeInvalidFeedbackIfExists();

  const posts = document.querySelector('.posts');
  const newPostsUl = document.createElement('ul');
  state.form.fields.posts.forEach(({ postsWithId }) => {
    postsWithId.forEach(({ postInner, id }) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', postInner.link);
      link.textContent = postInner.title;
      link.classList.add('fw-normal');
      const button = document.createElement('button');
      button.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal">
      Посмотреть
    </button>`;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const modalBody = document.querySelector('.modal-body');
        modalBody.textContent = postInner.description;
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.textContent = postInner.title;
        const modalMore = document.querySelector('.modal-footer .btn');
        modalMore.setAttribute('href', postInner.link);
        // eslint-disable-next-line no-param-reassign
        state.uiState[id].seen = true;
        link.classList.replace('fw-normal', 'fw-bold');
      });
      li.append(link, button);
      newPostsUl.append(li);
    });
  });
  posts.replaceChildren(newPostsUl);
};

export const renderError = (error, element) => {
  element.classList.add('is-invalid');
  const existingFeedback = document.querySelector('.invalid-feedback');
  if (!existingFeedback) {
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.textContent = error;
    element.after(feedbackElement);
  } else {
    existingFeedback.textContent = error;
  }
};
