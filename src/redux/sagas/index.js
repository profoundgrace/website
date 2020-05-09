import { all, fork } from 'redux-saga/effects';

import auth from './auth';
import book from './book';
import books from './books';
import editor from './editor';
import navigator from './navigator';
import privilege from './privilege';
import role from './role';
import search from './search';
import toast from './toast';
import user from './user';

export default function* saga() {
  yield all(
    [
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
    ].map(fork)
  );
}
