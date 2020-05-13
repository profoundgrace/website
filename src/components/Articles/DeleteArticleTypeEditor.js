import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { Alert, Button, ButtonGroup, Card, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as articleTypeActions } from 'redux/reducers/articleTypes';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';

export class DeleteArticleTypeEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    displayEditor: PropTypes.object,
    articleType: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    articleType: {}
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
  }

  hideEditor() {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteArticleType', status: false });
    actions.displayEditor({ editor: 'articleType', status: false });
    actions.displayEditor({ editor: 'articleTypes', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteArticleType', status: false });
    actions.displayEditor({ editor: 'articleType', status: false });
    actions.displayEditor({ editor: 'articleTypes', status: false });
    actions.deleteArticleType(values);
  }

  render() {
    const { articleType, user } = this.props;
    const { _key } = articleType;

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">{`Delete Article Type ${articleType.title}`}</Card.Header>
          <Alert variant="danger" className="font-weight-bold">
            Deleting an Article Type is permanent: all content will also be
            deleted!
          </Alert>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field name="_key">
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
      ...articleTypeActions
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteArticleTypeEditor);
