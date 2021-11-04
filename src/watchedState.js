export default (elements, state, i18n) => (
    onChange(state, (path, value) => {
    switch (path) {
      case ('form.fields.url'): {
        const currentFeedsList = state.form.fields.feeds.map((feed) => feed.link);
        if (currentFeedsList.includes(value)) {
          renderFeedback(feedbackElement, 'error', i18nextInstance.t('duplicate'));
          changeFormRenderState(form);
        } else {
          axios(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`)
            .then((response) => {
              if (response.status === 200) {
                const data = parser(response.data);
                const feedId = ID();
                data.feed.id = feedId;
                data.feed.link = value;
                state.form.fields.feeds.push(data.feed);

                const postsWithId = [];
                data.posts.forEach((post) => {
                  const postId = ID();
                  postsWithId.push({
                    id: postId,
                    postInner: post,
                  });
                  state.uiState[postId] = { seen: false };
                });
                state.form.fields.posts.push({ feedId, postsWithId });
                renderFeedback(feedbackElement, 'success', i18nextInstance.t('success'));
                renderFeeds(state);
                renderPosts(state);
                changeFormRenderState(form);
                state.form.fields.url = '';
              }
            }).catch(errorHandler);
        }
        break;
      }
      case ('form.fields.checkFeed'): {
        axios(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value.link)}`)
          .then((response) => {
            if (response.status === 200) {
              const data = parser(response.data);
              const currentPostsIndex = state.form.fields.posts.findIndex(
                (unfilteredPost) => unfilteredPost.feedId === value.id,
              );

              const currentFeedPostsList = state.form.fields.posts[currentPostsIndex].postsWithId
                .map((postUnit) => postUnit.postInner);

              const newPosts = _.differenceWith(data.posts, currentFeedPostsList, _.isEqual);

              if (newPosts.length > 0) {
                const newPostsWithId = [];
                newPosts.forEach((post) => {
                  const postId = ID();
                  newPostsWithId.push({
                    id: postId,
                    postInner: post,
                  });
                  state.uiState[postId] = { seen: false };
                });
                state.form.fields.posts[currentPostsIndex].postsWithId.unshift(...newPostsWithId);
                renderPosts(state);
              }
            }
          }).catch(errorHandler);
        state.form.fields.checkFeed = null;
        break;
      }

      default:
        break;
    }
  })
);