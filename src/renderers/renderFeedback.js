export default (elements, state, i18n) => {
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