import { all, call, put, takeLatest } from 'redux-saga/effects';
import helper from 'utils/saga';
import request from 'utils/request';
import { actions, types } from 'redux/reducers/forum';

function* requestForumWorker({ forum: { name } }) {
  try {
    yield put(actions.requestForumLoading(true));
    const endpoint = {
      url: `/bb/forum/name/${name}`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestSuccess({ reqType: 'forum', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get forum!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestForumsWorker({ forum: { parent } }) {
  try {
    yield put(actions.requestForumLoading(true));
    let url;
    if (parent) {
      url =
        parent === 'main'
          ? `/bb/forums/main`
          : `/bb/forums/name/${parent}/children`;
    } else {
      url = `/bb/forums`;
    }
    const endpoint = {
      url,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestSuccess({ reqType: 'collection', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get forums!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestSubforumsWorker({ forum: { parent } }) {
  try {
    yield put(actions.requestForumLoading(true));
    let url;
    if (parent) {
      url =
        parent === 'main'
          ? `/bb/forums/main`
          : `/bb/forums/name/${parent}/children`;
    } else {
      url = `/bb/forums`;
    }
    const endpoint = {
      url,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestSuccess({ reqType: 'children', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get forums!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestForumTopicsWorker({ forum: { _key, name } }) {
  try {
    yield put(actions.requestForumLoading(true));
    const endpoint = {
      url: _key
        ? `/bb/forum/id/${_key}/topics`
        : `/bb/forum/name/${name}/topics`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestSuccess({ reqType: 'topics', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get forum!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestTopicWorker({ topic: { _key } }) {
  try {
    yield put(actions.requestForumLoading(true));
    const endpoint = {
      url: `/bb/topic/${_key}`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;
      yield put(actions.requestSuccess({ reqType: 'topic', data: data[0] }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get topic!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestTopicCommentsWorker({ topic: { _key } }) {
  try {
    yield put(actions.requestForumLoading(true));
    const endpoint = {
      url: `/bb/topic/${_key}/comments`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;

      yield put(actions.requestSuccess({ reqType: 'comments', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get topic replies!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestLatestTopicsWorker({ topic: { forum } }) {
  try {
    yield put(actions.requestForumLoading(true));
    const endpoint = {
      url: forum
        ? `/bb/forum/${forum}/latest/topics/`
        : `/bb/forum/latest/topics`,
      method: 'GET'
    };
    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      const {
        response: { data }
      } = result;
      yield put(actions.requestSuccess({ reqType: 'latestTopics', data }));
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error('Failed to get topic!');
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addForumWorker({
  details: {
    _key,
    adminOnly,
    description,
    icon,
    name,
    ratings,
    parent,
    replies,
    title,
    topics,
    update
  }
}) {
  try {
    if (parent === 'main') {
      parent = null;
    }

    const endpoint = {
      url: !update ? `/bb/forum` : `/bb/forum/${_key}`,
      method: !update ? 'POST' : 'PUT'
    };

    const data = {
      description,
      icon,
      name,
      options: { ratings, adminOnly },
      parent,
      replies,
      title,
      topics
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestForums({ parent: null }));
      yield call(helper.toast, {
        title: !update ? 'Forum Created' : `Forum Updated`,
        message: !update
          ? `Forum ${name} successfully added!`
          : `Forum ${name} successfully updated!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to add Forum!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addTopicWorker({
  details: { _key, forum, replies, text, title, userId, views, update }
}) {
  try {
    let data = {
      options: {},
      text,
      title
    };

    if (!update) {
      data = {
        ...data,
        createdDate: new Date(),
        forum,
        rating: {},
        replies,
        userId,
        views
      };
    } else {
      data = {
        ...data,
        updatedDate: new Date()
      };
    }

    const endpoint = {
      url: !update ? `/bb/topic` : `/bb/topic/${_key}`,
      method: !update ? 'POST' : 'PUT'
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestForumTopics({ _key: forum }));
      if (update) {
        yield put(actions.requestTopic({ _key }));
      }
      yield call(helper.toast, {
        title: !update ? 'Topic Created' : `Topic Updated`,
        message: !update
          ? `Topic ${title} successfully added!`
          : `Topic ${title} successfully updated!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to create topic!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* addCommentWorker({
  details: { _key, forum, text, topic, userId, update }
}) {
  try {
    let data = {
      text
    };

    if (!update) {
      data = {
        ...data,
        createdDate: new Date(),
        forum,
        rating: {},
        topic,
        userId
      };
    } else {
      data = {
        ...data,
        updatedDate: new Date()
      };
    }

    const endpoint = {
      url: !update ? `/bb/comment` : `/bb/comment/${_key}`,
      method: !update ? 'POST' : 'PUT'
    };

    const result = yield call(request.execute, { endpoint, data });

    if (result.success) {
      yield put(actions.requestTopicComments({ _key: topic }));
      yield call(helper.toast, {
        title: !update ? 'Reply Created' : `Reply Updated`,
        message: !update
          ? `Reply successfully added!`
          : `Reply successfully updated!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to create topic!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteForumWorker({ forum: { forum } }) {
  try {
    const endpoint = {
      url: `/bb/forum/${forum}`,
      method: 'DELETE'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestForums({ parent: null }));
      yield call(helper.toast, {
        title: 'Forum Deleted',
        message: `Forum successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete forum!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteTopicWorker({ topic: { forum, topic } }) {
  try {
    const endpoint = {
      url: `/bb/topic/${topic}`,
      method: 'DELETE'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestTopic({ _key: topic }));
      yield call(helper.toast, {
        title: 'Topic Deleted',
        message: `Topic successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete topic!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* deleteCommentWorker({ comment: { forum, topic, comment } }) {
  try {
    const endpoint = {
      url: `/bb/comment/${comment}`,
      method: 'DELETE'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      yield put(actions.requestTopicComments({ topic }));
      yield call(helper.toast, {
        title: 'Comment Deleted',
        message: `Comment successfully deleted!`
      });
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to delete comment!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* metaAddTopicWorker({ details: { forum } }) {
  try {
    const endpoint = {
      url: `/bb/forum-meta/new-topic/forum/${forum}`,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      // Do nothing
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to update topic count!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* metaAddCommentWorker({ details: { topic } }) {
  try {
    const endpoint = {
      url: `/bb/forum-meta/new-comment/topic/${topic}`,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      // Do nothing
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to update comment count!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* metaAddViewWorker({ details: { topic } }) {
  try {
    const endpoint = {
      url: `/bb/forum-meta/view/topic/${topic}`,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      // Do nothing
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to update topic view count!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* metaDeleteTopicWorker({ details: { forum, replies } }) {
  try {
    const endpoint = {
      url: `/bb/forum-meta/delete-topic/forum/${forum}/?replies=${replies}`,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      // Do nothing
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to update topic count!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* metaDeleteCommentWorker({ details: { topic } }) {
  try {
    const endpoint = {
      url: `/bb/forum-meta/delete-comment/topic/${topic}`,
      method: 'GET'
    };

    const result = yield call(request.execute, { endpoint });

    if (result.success) {
      // Do nothing
    } else if (result.error) {
      throw result.error;
    } else {
      throw new Error(`Failed to update comment count!`);
    }
  } catch (error) {
    const { message } = error;

    yield put(actions.requestFailure(error));
    yield call(helper.errorToast, message);
  }
}

function* requestForumWatcher() {
  yield takeLatest(types.REQUEST_FORUM, requestForumWorker);
}

function* requestForumsWatcher() {
  yield takeLatest(types.REQUEST_FORUMS, requestForumsWorker);
}

function* requestSubforumsWatcher() {
  yield takeLatest(types.REQUEST_SUBFORUMS, requestSubforumsWorker);
}

function* requestForumTopicsWatcher() {
  yield takeLatest(types.REQUEST_FORUM_TOPICS, requestForumTopicsWorker);
}

function* requestTopicWatcher() {
  yield takeLatest(types.REQUEST_TOPIC, requestTopicWorker);
}

function* requestTopicCommentsWatcher() {
  yield takeLatest(types.REQUEST_TOPIC_COMMENTS, requestTopicCommentsWorker);
}

function* requestLatestTopicsWatcher() {
  yield takeLatest(types.REQUEST_LATEST_TOPICS, requestLatestTopicsWorker);
}

function* addForumWatcher() {
  yield takeLatest(types.ADD_FORUM, addForumWorker);
}

function* addTopicWatcher() {
  yield takeLatest(types.ADD_TOPIC, addTopicWorker);
}

function* addCommentWatcher() {
  yield takeLatest(types.ADD_COMMENT, addCommentWorker);
}

function* deleteForumWatcher() {
  yield takeLatest(types.DELETE_FORUM, deleteForumWorker);
}

function* deleteTopicWatcher() {
  yield takeLatest(types.DELETE_TOPIC, deleteTopicWorker);
}

function* deleteCommentWatcher() {
  yield takeLatest(types.DELETE_COMMENT, deleteCommentWorker);
}

function* metaAddTopicWatcher() {
  yield takeLatest(types.META_ADD_TOPIC, metaAddTopicWorker);
}

function* metaAddCommentWatcher() {
  yield takeLatest(types.META_ADD_COMMENT, metaAddCommentWorker);
}

function* metaAddViewWatcher() {
  yield takeLatest(types.META_ADD_VIEW, metaAddViewWorker);
}

function* metaDeleteTopicWatcher() {
  yield takeLatest(types.META_DELETE_TOPIC, metaDeleteTopicWorker);
}

function* metaDeleteCommentWatcher() {
  yield takeLatest(types.META_DELETE_COMMENT, metaDeleteCommentWorker);
}

export const workers = {
  requestForumWorker,
  requestForumsWorker,
  requestSubforumsWorker,
  requestForumTopicsWorker,
  requestTopicWorker,
  requestTopicCommentsWorker,
  requestLatestTopicsWorker,
  addForumWorker,
  addTopicWorker,
  addCommentWorker,
  deleteForumWorker,
  deleteTopicWorker,
  deleteCommentWorker,
  metaAddTopicWorker,
  metaAddCommentWorker,
  metaAddViewWorker,
  metaDeleteTopicWorker,
  metaDeleteCommentWorker
};

export const watchers = {
  requestForumWatcher,
  requestForumsWatcher,
  requestSubforumsWatcher,
  requestForumTopicsWatcher,
  requestTopicWatcher,
  requestTopicCommentsWatcher,
  requestLatestTopicsWatcher,
  addForumWatcher,
  addTopicWatcher,
  addCommentWatcher,
  deleteForumWatcher,
  deleteTopicWatcher,
  deleteCommentWatcher,
  metaAddTopicWatcher,
  metaAddCommentWatcher,
  metaAddViewWatcher,
  metaDeleteTopicWatcher,
  metaDeleteCommentWatcher
};

export default function* saga() {
  yield all(Object.values(watchers).map((watcher) => watcher()));
}
