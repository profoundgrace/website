import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as userActions } from 'redux/reducers/user';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getUser, getUserLoading } from 'redux/selectors/user';
import PasswordEditor from 'components/User/PasswordEditor';
import UserEditor from 'components/User/UserEditor';
import Loading from 'components/Loading';

export class User extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object,
    displayEditor: PropTypes.object,
    loading: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };

  static defaultProps = {
    account: {},
    displayEditor: {
      user: false,
      password: false
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      active: 'User'
    };
  }

  componentDidMount() {
    const { actions, user } = this.props;

    if (user) actions.requestUser({ _key: user?.id });
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      const { actions, user } = this.props;

      actions.requestUser({ _key: user?.id });
    }
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'user', status: false });
  }

  userEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'user',
      status: !displayEditor.user
    });
  }

  passwordEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'password',
      status: !displayEditor.password
    });
  }

  displayDate(date) {
    const dateObject = new Date(date);
    return dateObject.toDateString();
  }

  displayTime(date) {
    const dateObject = new Date(date);
    return dateObject.toLocaleTimeString('en-US');
  }

  render() {
    const { loggedIn } = this.props;

    if (!loggedIn) {
      return <Redirect to="/" />;
    }

    const { account, displayEditor, loading } = this.props;
    let { active, links } = this.state;
    const { email, username } = account;

    return (
      <Container fluid>
        <Helmet title="User Account" />
        <h1>Account</h1>
        <Breadcrumbs base={null} links={links} active={active} />

        {displayEditor?.user === true && <UserEditor account={account} />}
        {displayEditor?.password === true && (
          <PasswordEditor account={account} />
        )}
        <Row className="mt-3">
          <Col>
            {!loading ? (
              <Fragment>
                {account ? (
                  <Fragment>
                    <h4>{username}</h4>
                    Email: {email}
                    {!displayEditor?.user && !displayEditor?.password ? (
                      <Row>
                        <Col className="text-center">
                          <Button
                            className="mr-2"
                            onClick={() => this.userEditor()}
                            title={`Edit`}
                          >
                            <FontAwesomeIcon icon={['fas', 'edit']} size="1x" />{' '}
                            Update Profile
                          </Button>

                          <Button
                            className="mr-2"
                            onClick={() => this.passwordEditor()}
                            title={`Edit`}
                          >
                            <FontAwesomeIcon icon={['fas', 'edit']} size="1x" />{' '}
                            Update Password
                          </Button>
                        </Col>
                      </Row>
                    ) : null}
                  </Fragment>
                ) : (
                  <Container className="text-center">
                    <h5>No User Available</h5>
                  </Container>
                )}
              </Fragment>
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  account: getUser(state),
  displayEditor: getEditorStatus(state),
  loading: getUserLoading(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...userActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
