import { buildActions } from 'utils';

export const types = buildActions('articleTypes', [
  'CREATE_ARTICLE_TYPE',
  'DELETE_ARTICLE_TYPE',
  'UPDATE_ARTICLE_TYPE',
  'REQUEST_ARTICLE_TYPE',
  'REQUEST_ARTICLE_TYPE_SUCCESS',
  'REQUEST_ARTICLE_TYPES',
  'REQUEST_ARTICLE_TYPES_FAILURE',
  'REQUEST_ARTICLE_TYPES_LOADING',
  'REQUEST_ARTICLE_TYPES_SUCCESS'
]);

const createArticleType = (articleType) => ({
  type: types.CREATE_ARTICLE_TYPE,
  articleType
});

const deleteArticleType = (articleType) => ({
  type: types.DELETE_ARTICLE_TYPE,
  articleType
});

const updateArticleType = (articleType) => ({
  type: types.UPDATE_ARTICLE_TYPE,
  articleType
});

const requestArticleType = (articleType) => ({
  type: types.REQUEST_ARTICLE_TYPE,
  articleType
});

const requestArticleTypes = () => ({
  type: types.REQUEST_ARTICLE_TYPES
});

const requestArticleTypesFailure = (error) => ({
  type: types.REQUEST_ARTICLE_TYPES_FAILURE,
  error
});

const requestArticleTypesLoading = (status) => ({
  type: types.REQUEST_ARTICLE_TYPES_LOADING,
  status
});

const requestArticleTypeSuccess = (articleType) => ({
  type: types.REQUEST_ARTICLE_TYPE_SUCCESS,
  articleType
});

const requestArticleTypesSuccess = (collection) => ({
  type: types.REQUEST_ARTICLE_TYPES_SUCCESS,
  collection
});

export const actions = {
  createArticleType,
  deleteArticleType,
  updateArticleType,
  requestArticleType,
  requestArticleTypes,
  requestArticleTypesFailure,
  requestArticleTypesLoading,
  requestArticleTypeSuccess,
  requestArticleTypesSuccess
};

export const initialState = {
  collection: [],
  loading: false,
  articleType: {}
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_ARTICLE_TYPES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case types.REQUEST_ARTICLE_TYPES_LOADING:
      return {
        ...state,
        loading: action.status
      };
    case types.REQUEST_ARTICLE_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        articleType: action.articleType
      };
    case types.REQUEST_ARTICLE_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        collection: action.collection
      };
    default:
      return state;
  }
};
