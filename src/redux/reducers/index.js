import { combineReducers } from 'redux';

import { reducer as auth, initialState as authState } from './auth';
import { reducer as book, initialState as bookState } from './book';
import { reducer as books, initialState as booksState } from './books';
import { reducer as editor, initialState as editorState } from './editor';
import {
  reducer as navigator,
  initialState as navigatorState
} from './navigator';
import {
  reducer as privilege,
  initialState as privilegeState
} from './privilege';
import { reducer as role, initialState as roleState } from './role';
import { reducer as search, initialState as searchState } from './search';
import { reducer as toast, initialState as toastState } from './toast';
import { reducer as user, initialState as userState } from './user';

export const initialState = {
  auth: authState,
  book: bookState,
  books: booksState,
  editor: editorState,
  navigator: navigatorState,
  privilege: privilegeState,
  role: roleState,
  search: searchState,
  toast: toastState,
  user: userState
};

export default combineReducers({
  auth,
  book,
  books,
  editor,
  navigator,
  privilege,
  role,
  search,
  toast,
  user
});
