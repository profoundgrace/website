import { combineReducers } from 'redux';

import {
  reducer as book,
  initialState as bookState
} from './book';
import {
  reducer as books,
  initialState as booksState
} from './books';
import {
  reducer as navigator,
  initialState as navigatorState
} from './navigator';

export const initialState = {
  book: bookState,
  books: booksState,
  navigator: navigatorState
};

export default combineReducers({
  book, books, navigator
});
