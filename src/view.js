export const renderFeeds = (state) => {
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
  const posts = document.querySelector('.posts');
  const newPostsUl = document.createElement('ul');
  state.form.fields.posts.forEach(({ postsWithId }) => {
    postsWithId.forEach(({ postInner, id }) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      link.setAttribute('href', postInner.link);
      link.textContent = postInner.title;
      link.classList.add('fw-normal');
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = 'Просмотр';
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

export const renderFeedback = (element, feedbackType, message) => {
  element.innerHTML = '';
  const testingUrlElement = document.createElement('p');
  testingUrlElement.classList.add('mt-2', 'mb-0', 'text-muted');
  testingUrlElement.textContent = 'Пример: http://lorem-rss.herokuapp.com/feed';
  const feedbackTextElement = document.createElement('p');
  feedbackTextElement.classList.add('feedback', 'm-0', 'position-absolute', 'small');

  if (feedbackType === 'error') {
    feedbackTextElement.classList.add('text-danger');
    feedbackTextElement.textContent = message;
  } else if (feedbackType === 'success') {
    feedbackTextElement.classList.add('text-success');
    feedbackTextElement.textContent = message;
  }

  element.append(testingUrlElement, feedbackTextElement);
};

export const changeFormRenderState = (element) => {
  const button = element.querySelector('button');
  const input = element.querySelector('input');

  button.classList.toggle('disabled');
  input.classList.toggle('readonly');

}