import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import stringSanitizer from 'string-sanitizer';
import { actions, types } from 'redux/reducers/articles';

function* createArticleWorker({
  article: {
    articleTypeId,
    createdDate,
    slugFormat,
    status,
    summary,
    text,
    title,
    userId
  }
}) {
  try {
    yield put(actions.requestArticlesLoading(true));

    const data = {
      articleTypeId,
      createdDate: createdDate || new Date(),
      sanitizedTitle: stringSanitizer.sanitize.addDash(title.toLowerCase()),
      slugFormat,
      status,
      summary,
      text,
      title,
      userId
    };

    const endpoint = {
      url: `/articles/content`,
      method: 'POST'
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestArticlesLoading(false));
      yield put(actions.requestArticles({ articleType: null }));
      yield call(helper.toast, {
        title: 'Articles',
        message: `Article successfully created!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to create Article!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticlesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteArticleWorker({ article: { _key } }) {
  try {
    yield put(actions.requestArticlesLoading(true));

    const endpoint = {
      url: `/articles/content/${_key}`,
      method: 'DELETE'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestArticlesLoading(false));
      yield put(actions.requestArticles({ articleType: null }));
      yield call(helper.toast, {
        title: 'Articles',
        message: `Article successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to delete Article!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticlesFailure(error));
    yield call(helper.errorToast, message);
  }
}

export function formatSlug(
  format,
  date = new Date(),
  id,
  title = '[title not set]'
) {
  let url;
  let year;
  let monthDate;
  let dateDate;
  let mmDate;
  let ddDate;

  if (format === ('date-id' || 'date-title')) {
    year = date.getFullYear();
    monthDate = date.getMonth() + 1;
    dateDate = date.getDate();
    mmDate = monthDate >= 10 ? monthDate : `0${monthDate}`;
    ddDate = dateDate >= 10 ? dateDate : `0${dateDate}`;
  }
  if (format === ('date-title' || 'id-title' || 'title' || 'title-id')) {
    title = stringSanitizer.sanitize.addDash(title.toLowerCase());
  }

  switch (format) {
    case 'date-id':
      url = `${year}-${mmDate}-${ddDate}-${id}`;
      break;
    case 'date-title':
      url = `${year}-${mmDate}-${ddDate}-${title}`;
      break;
    case 'id':
      url = `${id}`;
      break;
    case 'id-title':
      url = `${id}-${title}`;
      break;
    case 'title':
      url = `${title}`;
      break;
    case 'title-id':
      url = `${title}-${id}`;
      break;
    default:
      url = `${title}-${id}`;
      break;
  }
  return url;
}

function* requestArticleWorker({ article: { _key, articleType, article } }) {
  try {
    yield put(actions.requestArticlesLoading(true));

    //const options = yield select(getArticlesOptions);

    let endpoint = {};
    endpoint = {
      url: _key
        ? `/articles/content/${_key}`
        : `/articles/type/${articleType}/content/${article}`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestArticleSuccess(data[0]));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to fetch Article!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticlesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestArticlesWorker({ articles: { articleType } }) {
  try {
    yield put(actions.requestArticlesLoading(true));

    //const options = yield select(getArticlesOptions);

    let endpoint = {};
    endpoint = {
      url: articleType
        ? `/articles/content/type/${articleType}`
        : `/articles/content`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestArticlesSuccess(data));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to fetch Articles!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticlesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* updateArticleWorker({
  article: { _key, slug, slugFormat, status, summary, text, title, updatedSlug }
}) {
  try {
    yield put(actions.requestArticlesLoading(true));

    if (updatedSlug) {
      const slugRegex = /[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi;
      slug = slug.replace(slugRegex, '');
    }

    const data = {
      sanitizedTitle: stringSanitizer.sanitize.addDash(title.toLowerCase()),
      slug: slug ? slug : _key,
      slugFormat,
      status,
      summary,
      text,
      title,
      updatedDate: new Date()
    };

    const endpoint = {
      url: `/articles/content/${_key}`,
      method: 'PUT'
    };
    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestArticlesLoading(false));
      yield put(actions.requestArticles({ articleType: null }));
      yield call(helper.toast, {
        title: 'Articles',
        message: `Article successfully updated!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to update Article!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestArticlesFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* createArticleWatcher() {
  yield takeLatest(types.CREATE_ARTICLE, createArticleWorker);
}

function* deleteArticleWatcher() {
  yield takeLatest(types.DELETE_ARTICLE, deleteArticleWorker);
}

function* requestArticleWatcher() {
  yield takeLatest(types.REQUEST_ARTICLE, requestArticleWorker);
}

function* requestArticlesWatcher() {
  yield takeLatest(types.REQUEST_ARTICLES, requestArticlesWorker);
}

function* updateArticleWatcher() {
  yield takeLatest(types.UPDATE_ARTICLE, updateArticleWorker);
}

export const workers = {
  createArticleWorker,
  deleteArticleWorker,
  requestArticleWorker,
  requestArticlesWorker,
  updateArticleWorker
};

export const watchers = {
  createArticleWatcher,
  deleteArticleWatcher,
  requestArticleWatcher,
  requestArticlesWatcher,
  updateArticleWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
