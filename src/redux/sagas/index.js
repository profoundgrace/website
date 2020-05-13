import { all, fork } from 'redux-saga/effects';

import articles from './articles';
import articleTypes from './articleTypes';
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
      articles,
      articleTypes,
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
