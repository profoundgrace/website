import { createSelector } from 'reselect';

export const getEditorSelector = state => state.editor;

export const getEditorStatus = createSelector(
  getEditorSelector,
  editor => editor.data
);
