import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Suspense } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { actions as authActions } from 'redux/reducers/auth';

import Header from "components/Header";
import Footer from "components/Footer";
import ToastDrawer from 'components/ToastDrawer/ToastDrawer';
import SuspenseFallback from 'components/SuspenseFallback/SuspenseFallback';

import {
  Bible,
  Book,
  Chapter,
  Home,
  Login,
  NotFound,
  Register,
  Search
} from 'pages';

export class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { actions } = this.props;

    actions.initApp();
  }

  render() {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <Helmet 
          defaultTitle="ProfoundGrace.org" 
          titleTemplate={`%s | ${process.env.REACT_APP_HTML_TITLE}`}
        />
        <Header />
        <ToastDrawer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/bible" component={Bible} />
          <Route exact path="/bible/ot" component={Bible} />
          <Route exact path="/bible/nt" component={Bible} />
          <Route exact path="/bible/:book" component={Book} />
          <Route exact path="/bible/:book/:chapter" component={Chapter} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </Suspense>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...authActions
    },
    dispatch
  )
});

export default withRouter(connect(null, mapDispatchToProps)(App));
