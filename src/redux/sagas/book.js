import { all, call, put, take, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { actions, types } from '../reducers/book';
import { getBookChapter } from '../selectors/book';

function* requestChapterWorker({ user }) {

}

function* requestChapterWatcher() {
  yield takeLatest(types.REQUEST_CHAPTER, requestChapterWorker);
}

export const workers = {
  requestChapterWorker
};

export const watchers = {
  requestChapterWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
