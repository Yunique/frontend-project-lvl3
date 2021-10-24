export default (data) => {
  const parser = new DOMParser();

  const { contents } = data;
  try {
    const parsed = parser.parseFromString(contents, 'text/xml');
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
  } catch (err) {
    throw new Error('Can\'t parse RSS.');
  }
};
