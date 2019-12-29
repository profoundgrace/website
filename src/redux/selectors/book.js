import { createSelector } from 'reselect';

export const getKJVBook = state => state.book;
/**
 * Get Current Book
 */
export const getBook = createSelector(
  getKJVBook,
  book => book.collection.book
);
/**
 * Get Current Chapter Text
 */
export const getBookChapter = createSelector(
  getKJVBook,
  book => book.collection.chapter
);
/**
 * Get Cached Book Data
 */
export const getBookCache = createSelector(
  getKJVBook,
  book => book.bookCache
);
/**
 * Get Cached Chapter Text
 */
export const getChapterCache = createSelector(
  getKJVBook,
  book => book.chapterCache
);
/**
 * Get Current Chapter Number
 */
export const getChapter = createSelector(
  getKJVBook,
  book => book.chapter
);
