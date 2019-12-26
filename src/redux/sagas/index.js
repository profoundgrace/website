import { all, fork } from 'redux-saga/effects';

import book from './book';
import books from './books';

export default function* saga() {
  yield all([book, books].map(fork));
}
