import _ from 'lodash';
import axios from 'axios';
import parser from './utils/parser.js';

const proxyfy = (link) => {
  const url = new URL('https://hexlet-allorigins.herokuapp.com/get');
  url.searchParams.set('url', link);
  url.searchParams.set('disableCache', 'true');

  return url;
};

const getFeed = (url) => {
  const link = proxyfy(url).toString();
  return axios.get(link);
};

export const loadFeed = (link) => getFeed(link).then((data) => parser(data.data.contents));

export const loadPosts = (watchedState) => {
  const requests = watchedState.feeds.map((feed) => getFeed(feed.url));
  return Promise
    .all(requests)
    .then((data) => data.forEach((feed) => {
      const { posts } = parser(feed);
      const newPosts = _.differenceBy(posts, watchedState.posts.postsList, 'link');

      const newPostsWithId = newPosts.map((newPost) => ({
        ...newPost,
        id: _.uniqueId(),
        feedId: feed.id,
      }));

      watchedState.posts.postsList.push(...newPostsWithId);
    }));
};
