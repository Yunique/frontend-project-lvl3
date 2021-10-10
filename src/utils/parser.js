export default (data) => {
  const parser = new DOMParser();

  const xml = data.contents;
  try {
    const parsed = parser.parseFromString(xml, 'text/xml');
    return {
      posts: parsed.querySelectorAll('item'),
      feed: {
        title: parsed.querySelector('channel > title'),
        description: parsed.querySelector('channel > description'),
      },
    };
  } catch (err) {
    throw new Error('Can\'t parse RSS.');
  }
};
