import nanoid from 'nanoid';
import { put, delay, takeEvery, all } from 'redux-saga/effects';

import { actions, types } from 'redux/reducers/toast';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
function* popToastWorker({ toast }) {
  // ensure there is a unique key for each toast
  const id = toast.id || nanoid();

  toast.id = id;
  toast.show = true;

  yield put(actions.addToast(toast));
  yield delay(toast.interval || 5000);
  yield put(actions.hideToast(id));
  // this is the default Fade transition time
  yield delay(500);
  yield put(actions.removeToast(id));
}

function* popToastWatcher() {
  yield takeEvery(types.POP_TOAST, popToastWorker);
}

export const workers = {
  popToastWorker
};

export const watchers = {
  popToastWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
