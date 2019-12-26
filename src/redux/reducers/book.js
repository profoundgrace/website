import { buildActions } from '../../utils';

export const types = buildActions('book', [
  'REQUEST_CHAPTER',
  'REQUEST_CHAPTER_SUCCESS',
  'REQUEST_CHAPTER_FAILURE'
]);

const requestChapter = chapter => ({
  type: types.REQUEST_CHAPTER,
  chapter
});

const requestChapterSuccess = chapter => ({
  type: types.REQUEST_CHAPTER_SUCCESS,
  chapter
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
        cache: action.chapter.cache,
        collection: action.chapter.request
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
