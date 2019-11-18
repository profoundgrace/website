import { all, fork } from 'redux-saga/effects';

import book from './book';

export default function* saga() {
  yield all([book].map(fork));
}
