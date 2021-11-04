export default (elements, state, i18n) => {
    const posts = document.querySelector('.posts');
    const newPostsUl = document.createElement('ul');
    state.form.fields.posts.forEach(({ postsWithId }) => {
      postsWithId.forEach(({ postInner, id }) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        const link = document.createElement('a');
        link.setAttribute('href', postInner.link);
        link.textContent = postInner.title;
        if (state.uiState[id].seen) {
          link.classList.add('fw-normal', 'link-secondary');
        } else {
          link.classList.add('fw-bold');
        }
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
          state.uiState[id].seen = true;
          link.classList.remove('fw-bold');
          link.classList.add('fw-normal', 'link-secondary');
        });
        li.append(link, button);
        newPostsUl.append(li);
      });
    });
    posts.replaceChildren(newPostsUl);
  };