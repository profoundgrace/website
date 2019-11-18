import { buildActions } from 'utils';

export const types = buildActions('book', [
  'REQUEST_CHAPTER',
  'REQUEST_CHAPTER_SUCCESS',
  'REQUEST_CHAPTER_FAILURE'
]);

const requestChapter = user => ({
  type: types.REQUEST_CHAPTER,
  user
});

const requestChapterSuccess = profile => ({
  type: types.REQUEST_CHAPTER_SUCCESS,
  profile
});

const requestChapterFailure = error => ({
  type: types.REQUEST_CHAPTER_FAILURE,
  error
});

export const actions = {
  requestChapter,
  requestChapterSuccess,
  requestChapterFailure
};

export const initialState = {
  cache: [],
  collection: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_CHAPTER_SUCCESS:
      return {
        ...state,
        cache: action.profile.cache,
        collection: action.profile.request,
        currentUser: action.profile.currentUser
      };
    case types.REQUEST_CHAPTER_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};
