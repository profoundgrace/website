import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import stringSanitizer from 'string-sanitizer';
import { actions, types } from 'redux/reducers/articleTypes';

function* createArticleTypeWorker({
  articleType: {
    description,
    name,
    slug,
    title,
    urlFormat,
    usePublishedDate,
    useSetDateAndTime,
    useStatus,
    useSummary,
    useSummaryAsIntro
  }
}) {
  try {
    yield put(actions.requestArticleTypesLoading(true));

    const data = {
      description,
      name: stringSanitizer.sanitize.addDash(name.toLowerCase()),
      options: {
        usePublishedDate,
        useSetDateAndTime,
        useStatus,
        useSummary,
        useSummaryAsIntro
      },
      slug: slug
        ? stringSanitizer.sanitize.addDash(slug.toLowerCase())
        : stringSanitizer.sanitize.addDash(name.toLowerCase()),
      title,
      urlFormat
    };

    const endpoint = {
      url: `/articles/type`,
      method: 'POST'
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestArticleTypesLoading(false));
      yield put(actions.requestArticleTypes());
      yield call(helper.toast, {
        title: 'Article Types',
        message: `Article Type successfully created!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to create Article Type!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticleTypesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteArticleTypeWorker({ articleType: { _key } }) {
  try {
    yield put(actions.requestArticleTypesLoading(true));

    const endpoint = {
      url: `/articles/type/${_key}`,
      method: 'DELETE'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestArticleTypesLoading(false));
      yield put(actions.requestArticleTypes());
      yield call(helper.toast, {
        title: 'Article Types',
        message: `Article Type successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to delete Article Type!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticleTypesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestArticleTypeWorker({ articleType: { _key } }) {
  try {
    yield put(actions.requestArticleTypesLoading(true));

    //const options = yield select(getArticleTypesOptions);

    let endpoint = {};
    endpoint = {
      url: `/articles/type/${_key}`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestArticleTypeSuccess(data));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to fetch Article Type!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticleTypesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestArticleTypesWorker() {
  try {
    yield put(actions.requestArticleTypesLoading(true));

    //const options = yield select(getArticleTypesOptions);

    let endpoint = {};
    endpoint = {
      url: `/articles/types`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestArticleTypesSuccess(data));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to fetch Article Types!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticleTypesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* updateArticleTypeWorker({
  articleType: {
    _key,
    description,
    name,
    slug,
    title,
    urlFormat,
    usePublishedDate,
    useSetDateAndTime,
    useStatus,
    useSummary,
    useSummaryAsIntro
  }
}) {
  try {
    yield put(actions.requestArticleTypesLoading(true));

    const data = {
      description,
      name: stringSanitizer.sanitize.addDash(name.toLowerCase()),
      options: {
        usePublishedDate,
        useSetDateAndTime,
        useStatus,
        useSummary,
        useSummaryAsIntro
      },
      slug: slug
        ? stringSanitizer.sanitize.addDash(slug.toLowerCase())
        : stringSanitizer.sanitize.addDash(name.toLowerCase()),
      title,
      urlFormat
    };

    const endpoint = {
      url: `/articles/type/${_key}`,
      method: 'PUT'
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestArticleTypesLoading(false));
      yield put(actions.requestArticleTypes());
      yield call(helper.toast, {
        title: 'Article Types',
        message: `Article Type successfully updated!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to update Article Type!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticleTypesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* createArticleTypeWatcher() {
  yield takeLatest(types.CREATE_ARTICLE_TYPE, createArticleTypeWorker);
}

function* deleteArticleTypeWatcher() {
  yield takeLatest(types.DELETE_ARTICLE_TYPE, deleteArticleTypeWorker);
}

function* requestArticleTypeWatcher() {
  yield takeLatest(types.REQUEST_ARTICLE_TYPE, requestArticleTypeWorker);
}

function* requestArticleTypesWatcher() {
  yield takeLatest(types.REQUEST_ARTICLE_TYPES, requestArticleTypesWorker);
}

function* updateArticleTypeWatcher() {
  yield takeLatest(types.UPDATE_ARTICLE_TYPE, updateArticleTypeWorker);
}

export const workers = {
  createArticleTypeWorker,
  deleteArticleTypeWorker,
  requestArticleTypeWorker,
  requestArticleTypesWorker,
  updateArticleTypeWorker
};

export const watchers = {
  createArticleTypeWatcher,
  deleteArticleTypeWatcher,
  requestArticleTypeWatcher,
  requestArticleTypesWatcher,
  updateArticleTypeWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
