import { createSelector } from 'reselect';

export const getArticlesState = (state) => state.articles;

export const getArticlesLoading = createSelector(
  getArticlesState,
  (articles) => articles.loading
);

export const getArticle = createSelector(
  getArticlesState,
  (articles) => articles.article
);

export const getArticles = createSelector(
  getArticlesState,
  (articles) => articles.collection
);
