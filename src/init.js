// @ts-check

import * as yup from 'yup';
import onChange from 'on-change';
import { render, renderError } from './view.js';

export default () => {
  const schema = yup.string().required().url();

  const form = document.createElement('form');
  const input = document.createElement('input');
  input.name = 'input';
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Maybe now?';
  const feed = document.createElement('div');
  feed.setAttribute('name', 'feed');
  const header = document.createElement('H1');
  header.innerHTML = 'Feed:';

  feed.append(header);
  form.append(button, input);
  document.body.append(form, feed);

  const state = {
    form: {
      fields: {
        url: '',
        feed: [],
      },
    },
  };

  const watchedState = onChange(state, (path, value) => {
    if (state.form.fields.feed.includes(value)) {
      console.log('caught');
      renderError('This URL is already in feed.', input);
    } else {
      state.form.fields.feed.push(value);
      render(state);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('input');
    schema.validate(inputValue).then((value) => {
      watchedState.form.fields.url = value;
      input.value = '';
      input.focus();
    }).catch((err) => {
      renderError(err.errors, input);
    });
  });
};
