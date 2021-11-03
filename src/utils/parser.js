export default (data) => {
  const parser = new DOMParser();
  const { contents } = data;

  const parsed = parser.parseFromString(contents, 'text/xml');
  const parseError = parsed.querySelector('parsererror');
  if (parseError) {
    const error = new Error();
    error.message = 'Parse Error';
    throw error;
  }
  const htmlPosts = parsed.querySelectorAll('item');
  const posts = [];
  htmlPosts.forEach((post) => {
    posts.push({
      link: post.querySelector('link').textContent,
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
    });
  });
  return {
    posts,
    feed: {
      title: parsed.querySelector('channel > title').textContent,
      description: parsed.querySelector('channel > description').textContent,
    },
  };
};
