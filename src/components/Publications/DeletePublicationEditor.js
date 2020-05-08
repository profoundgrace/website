import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Alert, Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as pubActions } from 'redux/reducers/publication';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';

export class DeletePublicationEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    publication: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    publication: {}
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deletePublication', status: false });
    actions.displayEditor({ editor: 'publication', status: false });
    actions.displayEditor({ editor: 'publications', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deletePublication', status: false });
    actions.displayEditor({ editor: 'publication', status: false });
    actions.displayEditor({ editor: 'publications', status: false });
    actions.deletePub(values);
  }

  render() {
    const { publication, user } = this.props;
    const { _key } = publication;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">{`Delete Publication ${publication.title}`}</Card.Header>
          <Alert variant="danger" className="font-weight-bold">
            Deleting a publication is permanent: all content will also be
            deleted!
          </Alert>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                publication: _key || null
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field name="publication">
                    {({ input, meta }) => (
                      <Form.Control {...input} type="hidden" />
                    )}
                  </Field>
                  <Form.Row>
                    <Form.Group>
                      <ButtonGroup>
                        <Button
                          variant="outline-success"
                          type="submit"
                          disabled={submitting}
                        >
                          <FontAwesomeIcon
                            icon={['fas', 'trash-alt']}
                            size="lg"
                          />
                          &nbsp;<span>Delete</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => this.hideEditor()}
                        >
                          <FontAwesomeIcon icon={['fas', 'ban']} size="lg" />
                          &nbsp;<span>Cancel</span>
                        </Button>
                      </ButtonGroup>
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
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...pubActions
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeletePublicationEditor);
