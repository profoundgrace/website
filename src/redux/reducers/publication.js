import { buildActions } from 'utils';

export const types = buildActions('publication', [
  'CREATE_PUB',
  'DELETE_PUB',
  'UPDATE_PUB',
  'REQUEST_PUB',
  'REQUEST_PUB_FAILURE',
  'REQUEST_PUB_LOADING',
  'REQUEST_PUB_SUCCESS'
]);

const createPub = (pubType) => ({
  type: types.CREATE_PUB,
  pubType
});

const deletePub = (pubType) => ({
  type: types.DELETE_PUB,
  pubType
});

const updatePub = (pubType) => ({
  type: types.UPDATE_PUB,
  pubType
});

const requestPub = (pubType) => ({
  type: types.REQUEST_PUB,
  pubType
});

const requestPubFailure = (error) => ({
  type: types.REQUEST_PUB_FAILURE,
  error
});

const requestPubLoading = (status) => ({
  type: types.REQUEST_PUB_LOADING,
  status
});

const requestPubSuccess = (collection) => ({
  type: types.REQUEST_PUB_SUCCESS,
  collection
});

export const actions = {
  createPub,
  deletePub,
  updatePub,
  requestPub,
  requestPubFailure,
  requestPubLoading,
  requestPubSuccess
};

export const initialState = {
  info: {},
  loading: false,
  collection: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.REQUEST_PUB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case types.REQUEST_PUB_LOADING:
      return {
        ...state,
        loading: action.status
      };
    case types.REQUEST_PUB_SUCCESS:
      return {
        ...state,
        loading: false,
        collection: action.collection
      };
    default:
      return state;
  }
};
