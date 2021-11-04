export default (elements, state, i18n) => {
    const button = element.querySelector('button');
    const input = element.querySelector('input');
  
    button.toggleAttribute('disabled');
    input.toggleAttribute('readonly');
  };