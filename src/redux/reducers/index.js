import { combineReducers } from 'redux';

import {
  reducer as book,
  initialState as bookState
} from './book';
import {
  reducer as books,
  initialState as booksState
} from './books';

export const initialState = {
  book: bookState,
  books: booksState
};

export default combineReducers({
  book, books
});
