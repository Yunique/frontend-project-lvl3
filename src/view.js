// @ts-check
// input.setAttribute('placeholder', 'ссылка RSS');
// input.setAttribute('autocomplete', 'off');
// input.setAttribute('aria-label', 'url');
// input.setAttribute('required', 'true');
// input.setAttribute('autofocus', 'true');

const makeUL = (array) => {
  const list = document.createElement('ul');
  for (let i = 0; i < array.length; i += 1) {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(array[i]));
    list.appendChild(item);
  }
  return list;
};

export const render = (state) => {
  const input = document.querySelector('input');
  if (input.classList.contains('is-invalid')) {
    const feedback = document.querySelector('.invalid-feedback');
    input.classList.remove('is-invalid');
    feedback.remove();
  }
  const feed = document.querySelector('div[name="feed"]');
  if (feed.querySelector('ul')) {
    feed.lastChild.replaceWith(makeUL(state.form.fields.feed));
  } else {
    feed.append(makeUL(state.form.fields.feed));
  }
};

export const renderError = (error, element) => {
  console.log(error, element);
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
