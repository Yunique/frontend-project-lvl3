// input.setAttribute('placeholder', 'ссылка RSS');
// input.setAttribute('autocomplete', 'off');
// input.setAttribute('aria-label', 'url');
// input.setAttribute('required', 'true');
// input.setAttribute('autofocus', 'true');

export const render = (state) => {
  const input = document.querySelector('input');
  if (input.classList.contains('is-invalid')) {
    const feedback = document.querySelector('.invalid-feedback');
    input.classList.remove('is-invalid');
    feedback.remove();
  }
  const feedsUl = document.querySelector('div[name="feeds"] > ul');
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
  feedsUl.replaceWith(newFeedsUl);

  const postsUl = document.querySelector('div[name="posts"] > ul');
  const newPostsUl = document.createElement('ul');
  state.form.fields.posts.forEach(({ postsWithId }) => {
    postsWithId.forEach(({ postInner }) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', postInner.link);
      link.textContent = postInner.title;
      li.append(link);
      newPostsUl.append(li);
    });
  });
  postsUl.replaceWith(newPostsUl);
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
