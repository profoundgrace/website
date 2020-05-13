import { buildActions } from 'utils';

export const types = buildActions('articles', [
  'CREATE_ARTICLE',
  'DELETE_ARTICLE',
  'UPDATE_ARTICLE',
  'REQUEST_ARTICLE',
  'REQUEST_ARTICLE_SUCCESS',
  'REQUEST_ARTICLES',
  'REQUEST_ARTICLES_FAILURE',
  'REQUEST_ARTICLES_LOADING',
  'REQUEST_ARTICLES_SUCCESS'
]);

const createArticle = (article) => ({
  type: types.CREATE_ARTICLE,
  article
});

const deleteArticle = (article) => ({
  type: types.DELETE_ARTICLE,
  article
});

const updateArticle = (article) => ({
  type: types.UPDATE_ARTICLE,
  article
});

const requestArticle = (article) => ({
  type: types.REQUEST_ARTICLE,
  article
});

const requestArticles = (articles) => ({
  type: types.REQUEST_ARTICLES,
  articles
});

const requestArticlesFailure = (error) => ({
  type: types.REQUEST_ARTICLES_FAILURE,
  error
});

const requestArticlesLoading = (status) => ({
  type: types.REQUEST_ARTICLES_LOADING,
  status
});

const requestArticleSuccess = (article) => ({
  type: types.REQUEST_ARTICLE_SUCCESS,
  article
});

const requestArticlesSuccess = (collection) => ({
  type: types.REQUEST_ARTICLES_SUCCESS,
  collection
});

export const actions = {
  createArticle,
  deleteArticle,
  updateArticle,
  requestArticle,
  requestArticles,
  requestArticlesFailure,
  requestArticlesLoading,
  requestArticleSuccess,
  requestArticlesSuccess
};

export const initialState = {
  collection: [],
  loading: false,
  article: {}
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_ARTICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case types.REQUEST_ARTICLES_LOADING:
      return {
        ...state,
        loading: action.status
      };
    case types.REQUEST_ARTICLE_SUCCESS:
      return {
        ...state,
        loading: false,
        article: action.article
      };
    case types.REQUEST_ARTICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        collection: action.collection
      };
    default:
      return state;
  }
};
