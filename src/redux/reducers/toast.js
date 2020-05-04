import { buildActions } from 'utils';
/**
 * Based on code by:
 * @author ayan4m1 <https://github.com/ayan4m1>
 * As of 20200225
 * Modified by:
 * @author daviddyess <https://github.com/daviddyess>
 */
export const types = buildActions('toast', [
  'POP_TOAST',
  'ADD_TOAST',
  'REMOVE_TOAST',
  'HIDE_TOAST'
]);

const popToast = toast => ({
  type: types.POP_TOAST,
  toast
});

const addToast = toast => ({
  type: types.ADD_TOAST,
  toast
});

const removeToast = id => ({
  type: types.REMOVE_TOAST,
  id
});

const hideToast = id => ({
  type: types.HIDE_TOAST,
  id
});

export const actions = {
  popToast,
  addToast,
  removeToast,
  hideToast
};

export const initialState = {
  queue: []
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.ADD_TOAST:
      return {
        ...state,
        queue: [...state.queue, action.toast]
      };
    case types.REMOVE_TOAST:
      return {
        ...state,
        queue: state.queue?.filter?.(toast => toast.id !== action.id)
      };
    case types.HIDE_TOAST: {
      const originalToast = state.queue?.find?.(
        toast => toast.id === action.id
      );

      if (!originalToast) {
        return state;
      }

      const newToast = {
        ...originalToast,
        show: false
      };
      const filteredToasts = state.queue?.filter?.(
        toast => toast.id !== action.id
      );

      return {
        ...state,
        queue: [...filteredToasts, newToast]
      };
    }
    default:
      return state;
  }
};
