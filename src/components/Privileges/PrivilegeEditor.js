import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as privilegeActions } from 'redux/reducers/privilege';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';

export class PrivilegeEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    privilege: PropTypes.object,
    user: PropTypes.object,
  };
  static defaultProps = {
    privilege: {},
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'privilege', status: false });
    actions.displayEditor({ editor: 'privileges', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'privilege', status: false });
    actions.displayEditor({ editor: 'privileges', status: false });
    actions.addPrivilege(values);
  }

  handleDelete() {
    const { actions, privilege } = this.props;

    actions.displayEditor({ editor: 'privilege', status: false });
    actions.displayEditor({ editor: 'privileges', status: false });
    actions.deletePrivilege(privilege);
  }

  render() {
    const { privilege, user } = this.props;

    const { _key, name, description } = privilege;

    const update = Boolean(privilege?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Privilege` : `Edit ${name}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                name: name || null,
                description: description || null,
                update,
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field name="name">
                      {({ input }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>Privilege</Form.Label>
                          <Form.Control {...input} />
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="description">
                      {({ input }) => (
                        <Form.Group as={Col} sm="6" md="4">
                          <Form.Group>
                            <Form.Control
                              {...input}
                              as="textarea"
                              placeholder="Optional Description"
                            />
                          </Form.Group>
                        </Form.Group>
                      )}
                    </Field>
                    <Field name="_key">
                      {({ input }) => <Form.Control {...input} type="hidden" />}
                    </Field>
                  </Form.Row>
                  <Form.Row className="mt-3">
                    <Form.Group>
                      <ButtonGroup>
                        <Button
                          variant="outline-success"
                          type="submit"
                          disabled={submitting}
                        >
                          <FontAwesomeIcon icon={['far', 'save']} size="lg" />
                          &nbsp;<span>Save</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => this.hideEditor()}
                        >
                          <FontAwesomeIcon icon={['fas', 'ban']} size="lg" />
                          &nbsp;<span>Cancel</span>
                        </Button>
                      </ButtonGroup>
                      {privilege?._key && (
                        <ButtonGroup className="ml-4">
                          <Button
                            variant="danger"
                            onClick={() => this.handleDelete()}
                          >
                            <FontAwesomeIcon
                              icon={['fas', 'trash-alt']}
                              size="lg"
                            />
                            &nbsp;<span>Delete</span>
                          </Button>
                        </ButtonGroup>
                      )}
                    </Form.Group>
                  </Form.Row>
                  {user?.privileges?.ui_debug && (
                    <Fragment>
                      Debug: <pre>{JSON.stringify(values, 0, 2)}</pre>
                    </Fragment>
                  )}
                </Form>
              )}
            />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...privilegeActions,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeEditor);
