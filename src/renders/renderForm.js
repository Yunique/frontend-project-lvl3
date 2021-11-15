export default (elements, state, i18nextInstance) => {
  const button = element.querySelector('button');
  const input = element.querySelector('input');

  button.toggleAttribute('disabled');
  input.toggleAttribute('readonly');
};
