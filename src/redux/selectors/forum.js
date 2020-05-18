import { createSelector } from 'reselect';

export const getForumsSelector = (state) => state.forum;

export const getForums = createSelector(
  getForumsSelector,
  (forum) => forum.collection
);

export const getSubforums = createSelector(
  getForumsSelector,
  (forum) => forum.children
);

export const getForum = createSelector(
  getForumsSelector,
  (forum) => forum.forum
);

export const getTopics = createSelector(
  getForumsSelector,
  (forum) => forum.topics
);

export const getTopic = createSelector(
  getForumsSelector,
  (forum) => forum.topic
);

export const getComments = createSelector(
  getForumsSelector,
  (forum) => forum.comments
);

export const getLatestTopics = createSelector(
  getForumsSelector,
  (forum) => forum.latest
);

export const getError = createSelector(
  getForumsSelector,
  (forum) => forum.error
);
