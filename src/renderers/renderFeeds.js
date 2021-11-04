export default (elements, state, i18n) => {
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