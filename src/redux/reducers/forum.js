import { buildActions } from 'utils';

export const types = buildActions('forum', [
  'REQUEST_FORUM',
  'REQUEST_FORUMS',
  'REQUEST_SUBFORUMS',
  'REQUEST_FORUM_TOPICS',
  'REQUEST_TOPIC',
  'REQUEST_TOPIC_COMMENTS',
  'ADD_FORUM',
  'ADD_TOPIC',
  'ADD_COMMENT',
  'DELETE_FORUM',
  'DELETE_TOPIC',
  'DELETE_COMMENT',
  'META_ADD_TOPIC',
  'META_ADD_COMMENT',
  'META_ADD_VIEW',
  'META_DELETE_TOPIC',
  'META_DELETE_COMMENT',
  'REQUEST_SUCCESS',
  'REQUEST_FAILURE',
  'RESET',
]);

const requestForum = (forum) => ({
  type: types.REQUEST_FORUM,
  forum,
});

const requestForums = (forum) => ({
  type: types.REQUEST_FORUMS,
  forum,
});

const requestSubforums = (forum) => ({
  type: types.REQUEST_SUBFORUMS,
  forum,
});

const requestForumTopics = (forum) => ({
  type: types.REQUEST_FORUM_TOPICS,
  forum,
});

const requestTopic = (topic) => ({
  type: types.REQUEST_TOPIC,
  topic,
});

const requestTopicComments = (topic) => ({
  type: types.REQUEST_TOPIC_COMMENTS,
  topic,
});

const addForum = (details) => ({
  type: types.ADD_FORUM,
  details,
});

const addTopic = (details) => ({
  type: types.ADD_TOPIC,
  details,
});

const addComment = (details) => ({
  type: types.ADD_COMMENT,
  details,
});

const deleteForum = (forum) => ({
  type: types.DELETE_FORUM,
  forum,
});

const deleteTopic = (topic) => ({
  type: types.DELETE_TOPIC,
  topic,
});

const deleteComment = (comment) => ({
  type: types.DELETE_COMMENT,
  comment,
});

const metaAddTopic = (details) => ({
  type: types.META_ADD_TOPIC,
  details,
});

const metaAddComment = (details) => ({
  type: types.META_ADD_COMMENT,
  details,
});

const metaAddView = (details) => ({
  type: types.META_ADD_VIEW,
  details,
});

const metaDeleteTopic = (details) => ({
  type: types.META_DELETE_TOPIC,
  details,
});

const metaDeleteComment = (details) => ({
  type: types.META_DELETE_COMMENT,
  details,
});

const requestSuccess = ({ reqType, data }) => ({
  type: types.REQUEST_SUCCESS,
  reqType,
  data,
});

const requestFailure = (error) => ({
  type: types.REQUEST_FAILURE,
  error,
});

const reset = (reqType) => ({
  type: types.RESET,
  reqType,
});

export const actions = {
  requestForum,
  requestForums,
  requestSubforums,
  requestForumTopics,
  requestTopic,
  requestTopicComments,
  addForum,
  addTopic,
  addComment,
  deleteForum,
  deleteTopic,
  deleteComment,
  metaAddTopic,
  metaAddComment,
  metaAddView,
  metaDeleteTopic,
  metaDeleteComment,
  requestSuccess,
  requestFailure,
  reset,
};

export const initialState = {
  error: {},
  children: [],
  collection: [],
  comments: [],
  forum: {},
  topic: {},
  topics: [],
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_SUCCESS:
      return {
        ...state,
        [action.reqType]: action.data,
      };
    case types.REQUEST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case types.RESET:
      return {
        ...state,
        [action.reqType]: {},
      };
    default:
      return state;
  }
};
