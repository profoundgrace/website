import { all, fork } from 'redux-saga/effects';

import book from './book';
import books from './books';
import navigator from './navigator';

export default function* saga() {
  yield all([book, books, navigator].map(fork));
}
