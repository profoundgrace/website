import { buildActions } from '../../utils';

export const types = buildActions('book', [
  'REQUEST_BOOK',
  'REQUEST_BOOK_SUCCESS',
  'REQUEST_BOOK_FAILURE',
  'REQUEST_CHAPTER',
  'REQUEST_CHAPTER_SUCCESS',
  'REQUEST_CHAPTER_FAILURE'
]);

const requestBook = book => ({
  type: types.REQUEST_BOOK,
  book
});

const requestBookSuccess = book => ({
  type: types.REQUEST_BOOK_SUCCESS,
  book
});

const requestBookFailure = error => ({
  type: types.REQUEST_BOOK_FAILURE,
  error
});

const requestChapter = ({book, chapter}) => ({
  type: types.REQUEST_CHAPTER,
  book,
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
  requestBook,
  requestBookSuccess,
  requestBookFailure,
  requestChapter,
  requestChapterSuccess,
  requestChapterFailure
};

export const initialState = {
  cache: {
    book: [],
    chapter: []
  },
  collection: {
    book: {},
    chapter: []
  }
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_BOOK_SUCCESS:
      return {
        ...state,
        cache: {
          ...state.cache,
          book: action.book.cache
        },
        collection: {
          ...state.collection,
          book: action.book.request
        }
      };
    case types.REQUEST_CHAPTER_SUCCESS:
      return {
        ...state,
        cache: {
          ...state.cache,
          chapter: action.chapter.cache
        },
        collection: {
          ...state.collection,
          chapter: action.chapter.request
        }
      };
    case types.REQUEST_BOOK_FAILURE:
      return {
        ...state,
        error: action.error
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
