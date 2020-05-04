import { buildActions } from 'utils';

export const types = buildActions('navigator', [
  'REQUEST_BOOK_NAV',
  'REQUEST_CHAPTER_NAV',
  'REQUEST_NAV_SUCCESS',
  'REQUEST_NAV_FAILURE'
]);

const requestBookNavigator = ({ book }) => ({
  type: types.REQUEST_BOOK_NAV,
  book
});

const requestChapterNavigator = ({ book, chapter }) => ({
  type: types.REQUEST_CHAPTER_NAV,
  book,
  chapter
});

const requestNavigatorSuccess = (nav) => ({
  type: types.REQUEST_NAV_SUCCESS,
  nav
});

const requestNavigatorFailure = (error) => ({
  type: types.REQUEST_NAV_FAILURE,
  error
});

export const actions = {
  requestBookNavigator,
  requestChapterNavigator,
  requestNavigatorSuccess,
  requestNavigatorFailure
};

export const initialState = {
  navigation: {}
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_NAV_SUCCESS:
      return {
        ...state,
        navigation: {
          ...state.navigation,
          ...action.nav
        }
      };
    case types.REQUEST_NAV_FAILURE:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};
