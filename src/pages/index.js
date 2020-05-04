import { lazy } from 'react';

export const imports = {
  Bible: () =>
    import(/* webpackChunkName: "bible" */ 'pages/Bible'),
  Book: () => import(/* webpackChunkName: "bible-book" */ 'pages/Book'),
  Chapter: () => import(/* webpackChunkName: "bible-chapter" */ 'pages/Chapter'),
  Home: () => import(/* webpackChunkName: "home" */ 'pages/Home'),
  Login: () => import(/* webpackChunkName: "login" */ 'pages/Login'),
  NotFound: () => import(/* webpackChunkName: "not-found" */ 'pages/NotFound'),
  Register: () => import(/* webpackChunkName: "register" */ 'pages/Register'),
  Search: () => import(/* webpackChunkName: "search" */ 'pages/Search')
};

export const Bible = lazy(imports.Bible);
export const Book = lazy(imports.Book);
export const Chapter = lazy(imports.Chapter);
export const Home = lazy(imports.Home);
export const Login = lazy(imports.Login);
export const NotFound = lazy(imports.NotFound);
export const Register = lazy(imports.Register);
export const Search = lazy(imports.Search);
