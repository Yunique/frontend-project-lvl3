// input.setAttribute('placeholder', 'ссылка RSS');
// input.setAttribute('autocomplete', 'off');
// input.setAttribute('aria-label', 'url');
// input.setAttribute('required', 'true');
// input.setAttribute('autofocus', 'true');

// const makeUL = (array) => {
//   const list = document.createElement('ul');
//   for (let i = 0; i < array.length; i += 1) {
//     const item = document.createElement('li');
//     item.appendChild(document.createTextNode(array[i]));
//     list.appendChild(item);
//   }
//   return list;
// };

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
    title.innerHTML = feed.title.textContent;
    const description = document.createElement('p');
    description.innerHTML = feed.description.textContent;
    li.append(title, description);
    newFeedsUl.append(li);
  });
  feedsUl.replaceWith(newFeedsUl);

  const postsUl = document.querySelector('div[name="posts"] > ul');
  const newPostsUl = document.createElement('ul');
  state.form.fields.posts.forEach((postList) => {
    postList.forEach(({ post }) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      const href = post.querySelector('link');
      const title = post.querySelector('title');
      link.setAttribute('href', href);
      link.textContent = title.textContent;
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
