import { createSelector } from 'reselect';

export const getKJVBook = state => state.book;

export const getBook = createSelector(
  getKJVBook,
  book => book.collection.book
);

export const getBookChapter = createSelector(
  getKJVBook,
  book => book.collection.chapter
);

export const getBookCache = createSelector(
  getKJVBook,
  book => book.bookCache
);

export const getChapterCache = createSelector(
  getKJVBook,
  book => book.chapterCache
);
