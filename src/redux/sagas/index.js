import { all, fork } from 'redux-saga/effects';

import auth from './auth';
import book from './book';
import books from './books';
import navigator from './navigator';
import toast from './toast';

export default function* saga() {
  yield all([auth, book, books, navigator, toast].map(fork));
}
