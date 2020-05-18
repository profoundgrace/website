import { lazy } from 'react';

export const imports = {
  AdminArticles: () =>
    import(/* webpackChunkName: "admin-articles" */ 'pages/Admin/Articles'),
  AdminArticleTypes: () =>
    import(
      /* webpackChunkName: "admin-article-types" */ 'pages/Admin/ArticleTypes'
    ),
  AdminForum: () =>
    import(/* webpackChunkName: "admin-forum" */ 'pages/Admin/Forum'),
  AdminPrivileges: () =>
    import(/* webpackChunkName: "admin-privileges" */ 'pages/Admin/Privileges'),
  AdminRoles: () =>
    import(/* webpackChunkName: "admin-roles" */ 'pages/Admin/Roles'),
  AdminUsers: () =>
    import(/* webpackChunkName: "admin-users" */ 'pages/Admin/Users'),
  Article: () => import(/* webpackChunkName: "article" */ 'pages/Article'),
  Articles: () => import(/* webpackChunkName: "articles" */ 'pages/Articles'),
  ArticleType: () =>
    import(/* webpackChunkName: "article-type" */ 'pages/ArticleType'),
  Bible: () => import(/* webpackChunkName: "bible" */ 'pages/Bible'),
  Book: () => import(/* webpackChunkName: "bible-book" */ 'pages/Book'),
  Chapter: () =>
    import(/* webpackChunkName: "bible-chapter" */ 'pages/Chapter'),
  Forum: () => import(/* webpackChunkName: "forum" */ 'pages/Forum'),
  ForumTopic: () =>
    import(/* webpackChunkName: "forum-topic" */ 'pages/ForumTopic'),
  ForumTopics: () =>
    import(/* webpackChunkName: "forum-topics" */ 'pages/ForumTopics'),
  Home: () => import(/* webpackChunkName: "home" */ 'pages/Home'),
  Login: () => import(/* webpackChunkName: "login" */ 'pages/Login'),
  NotFound: () => import(/* webpackChunkName: "not-found" */ 'pages/NotFound'),
  Register: () => import(/* webpackChunkName: "register" */ 'pages/Register'),
  Search: () => import(/* webpackChunkName: "search" */ 'pages/Search'),
  User: () => import(/* webpackChunkName: "user" */ 'pages/User')
};

export const AdminArticles = lazy(imports.AdminArticles);
export const AdminArticleTypes = lazy(imports.AdminArticleTypes);
export const AdminForum = lazy(imports.AdminForum);
export const AdminPrivileges = lazy(imports.AdminPrivileges);
export const AdminRoles = lazy(imports.AdminRoles);
export const AdminUsers = lazy(imports.AdminUsers);
export const Article = lazy(imports.Article);
export const Articles = lazy(imports.Articles);
export const ArticleType = lazy(imports.ArticleType);
export const Bible = lazy(imports.Bible);
export const Book = lazy(imports.Book);
export const Chapter = lazy(imports.Chapter);
export const Forum = lazy(imports.Forum);
export const ForumTopic = lazy(imports.ForumTopic);
export const ForumTopics = lazy(imports.ForumTopics);
export const Home = lazy(imports.Home);
export const Login = lazy(imports.Login);
export const NotFound = lazy(imports.NotFound);
export const Register = lazy(imports.Register);
export const Search = lazy(imports.Search);
export const User = lazy(imports.User);
