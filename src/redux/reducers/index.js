import { combineReducers } from 'redux';

import {
  reducer as auth,
  initialState as authState
} from './auth';
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
import {
  reducer as toast,
  initialState as toastState
} from './toast';

export const initialState = {
  auth: authState,
  book: bookState,
  books: booksState,
  navigator: navigatorState,
  toast: toastState
};

export default combineReducers({
  auth, book, books, navigator, toast
});
