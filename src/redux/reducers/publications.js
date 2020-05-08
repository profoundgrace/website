import { buildActions } from 'utils';

export const types = buildActions('publications', [
  'REQUEST_PUBS',
  'REQUEST_PUBS_FAILURE',
  'REQUEST_PUBS_LOADING',
  'REQUEST_PUBS_SUCCESS'
]);

const requestPubs = () => ({
  type: types.REQUEST_PUBS
});

const requestPubsFailure = (error) => ({
  type: types.REQUEST_PUBS_FAILURE,
  error
});

const requestPubsLoading = (status) => ({
  type: types.REQUEST_PUBS_LOADING,
  status
});

const requestPubsSuccess = (collection) => ({
  type: types.REQUEST_PUBS_SUCCESS,
  collection
});

export const actions = {
  requestPubs,
  requestPubsFailure,
  requestPubsLoading,
  requestPubsSuccess
};

export const initialState = {
  info: {},
  loading: false,
  collection: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_PUBS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case types.REQUEST_PUBS_LOADING:
      return {
        ...state,
        loading: action.status
      };
    case types.REQUEST_PUBS_SUCCESS:
      return {
        ...state,
        loading: false,
        collection: action.collection
      };
    default:
      return state;
  }
};
