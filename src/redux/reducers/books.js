import { buildActions } from 'utils';

export const types = buildActions('books', [
  'REQUEST_BOOKS',
  'REQUEST_BOOKS_SUCCESS',
  'REQUEST_BOOKS_FAILURE'
]);

const requestBooks = () => ({
  type: types.REQUEST_BOOKS
});

const requestBooksSuccess = books => ({
  type: types.REQUEST_BOOKS_SUCCESS,
  books
});

const requestBooksFailure = error => ({
  type: types.REQUEST_BOOKS_FAILURE,
  error
});

export const actions = {
  requestBooks,
  requestBooksSuccess,
  requestBooksFailure
};

export const initialState = {
  collection: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_BOOKS_SUCCESS:
      return {
        ...state,
        collection: action.books
      };
    case types.REQUEST_BOOKS_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};
