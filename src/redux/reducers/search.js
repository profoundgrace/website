import { buildActions } from 'utils';

export const types = buildActions('search', [
  'REQUEST_LOADING',
  'REQUEST_SEARCH',
  'REQUEST_SEARCH_SUCCESS',
  'REQUEST_SEARCH_FAILURE'
]);

const requestLoading = (status) => ({
  type: types.REQUEST_LOADING,
  status
});

const requestSearch = (search) => ({
  type: types.REQUEST_SEARCH,
  search
});

const requestSearchSuccess = (query, result, info) => ({
  type: types.REQUEST_SEARCH_SUCCESS,
  query,
  result,
  info
});

const requestSearchFailure = (error) => ({
  type: types.REQUEST_SEARCH_FAILURE,
  error
});

export const actions = {
  requestLoading,
  requestSearch,
  requestSearchSuccess,
  requestSearchFailure
};

export const initialState = {
  info: {},
  loading: false,
  options: {},
  query: '',
  result: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_LOADING:
      return {
        ...state,
        loading: action.status
      };
    case types.REQUEST_SEARCH_SUCCESS:
      return {
        ...state,
        info: action.info,
        loading: false,
        query: action.query,
        result: action.result
      };
    case types.REQUEST_SEARCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};
