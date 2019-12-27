import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "./Header";
import Home from "../pages/Home";
import Bible from "../pages/Bible";
import Book from "../pages/Book";
import Chapter from "../pages/Chapter";
import PopOver from "../pages/PopOver";
import NotFound from "../pages/NotFound";

export class App extends Component {
  render() {
    return (
      <Fragment>
        <Helmet 
          defaultTitle="ProfoundGrace.org" 
          titleTemplate={`%s | ${process.env.REACT_APP_HTML_TITLE}`}
        />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/bible" component={Bible} />
          <Route exact path="/bible/:book" component={Book} />
          <Route exact path="/bible/:book/:chapter" component={Chapter} />
          <Route exact path="/popover" component={PopOver} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
