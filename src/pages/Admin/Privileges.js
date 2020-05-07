import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as privilegeActions } from 'redux/reducers/privilege';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getPrivileges } from 'redux/selectors/privilege';
import PrivilegeEditor from 'components/Privileges/PrivilegeEditor';

export class AdminPrivileges extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    collection: PropTypes.array,
    user: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = { links: [], active: 'Privileges' };
    this.privilegeEditor = this.privilegeEditor.bind(this);
    this.privilegesEditor = this.privilegesEditor.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestPrivileges();
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'privileges', status: false });
    actions.displayEditor({ editor: 'privilege', status: false });
  }

  privilegesEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'privileges',
      status: !displayEditor.privileges
    });
  }

  privilegeEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'privilege', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Privileges" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Privileges</h2>
        {user?.privileges?.privileges_update && !displayEditor?.privileges && (
          <Button
            variant="primary"
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.privilegesEditor()}
            title={`Add Privilege`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add
          </Button>
        )}
        {user?.privileges?.privileges_update &&
          displayEditor?.privileges === true && <PrivilegeEditor />}
        <Row className="mt-3">
          <Col>
            {collection?.length > 0 ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Options</th>
                    <th>Privilege</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {collection &&
                    collection?.map &&
                    collection.map((privilege, index) => {
                      const { _key, name, description } = privilege;

                      return (
                        <Fragment key={`privileges_${_key}`}>
                          <tr>
                            <td className="text-center">
                              {user?.privileges?.privileges_update && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="mr-2 rounded-circle"
                                  onClick={() => this.privilegeEditor(_key)}
                                  title={`Edit ${name}`}
                                >
                                  <FontAwesomeIcon
                                    icon={['fas', 'edit']}
                                    size="1x"
                                  />
                                </Button>
                              )}
                            </td>
                            <td className="text-center">{name}</td>
                            <td>{description}</td>
                          </tr>
                          {user?.privileges?.privileges_update &&
                            displayEditor?.privilege === _key && (
                              <tr>
                                <td colSpan="7">
                                  <PrivilegeEditor privilege={privilege} />
                                </td>
                              </tr>
                            )}
                        </Fragment>
                      );
                    })}
                </tbody>
              </Table>
            ) : (
              'No Privileges are available'
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  collection: getPrivileges(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...privilegeActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPrivileges);
