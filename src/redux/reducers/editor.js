import { buildActions } from 'utils';

export const types = buildActions('editor', [
  'DISPLAY_EDITOR',
  'UPDATE_EDITOR'
]);

const displayEditor = ({ editor, status }) => ({
  type: types.DISPLAY_EDITOR,
  editor,
  status
});

const updateEditor = ({ editor, status }) => ({
  type: types.UPDATE_EDITOR,
  editor,
  status
});

export const actions = {
  displayEditor,
  updateEditor
};

export const initialState = {
  data: {}
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.UPDATE_EDITOR:
      return {
        ...state,
        data: {
          ...state.data,
          [action.editor]: action.status
        }
      };
    default:
      return state;
  }
};
