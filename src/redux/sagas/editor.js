import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import { actions, types } from 'redux/reducers/editor';

// snake_cased variables here come from RFC 6749
function* displayEditorWorker({ editor, status }) {
  try {
    yield put(actions.updateEditor({ editor, status }));
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* displayEditorWatcher() {
  yield takeLatest(types.DISPLAY_EDITOR, displayEditorWorker);
}

export const workers = {
  displayEditorWorker
};

export const watchers = {
  displayEditorWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map(watcher => watcher()));
}
