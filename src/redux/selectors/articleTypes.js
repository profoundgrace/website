import { createSelector } from 'reselect';

export const getArticleTypesState = (state) => state.articleTypes;

export const getArticleTypeLoading = createSelector(
  getArticleTypesState,
  (articleTypes) => articleTypes.loading
);

export const getArticleType = createSelector(
  getArticleTypesState,
  (articleTypes) => articleTypes.articleType
);

export const getArticleTypes = createSelector(
  getArticleTypesState,
  (articleTypes) => articleTypes.collection
);
