// @ts-check


export default () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');
  button.textContent = 'Click me!';
  form.append(input, button);
  document.body.append(form);
};
