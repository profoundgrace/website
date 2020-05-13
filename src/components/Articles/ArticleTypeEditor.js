import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as articleTypeActions } from 'redux/reducers/articleTypes';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, required } from 'utils/validation';
import stringSanitizer from 'string-sanitizer';

export class ArticleTypeEditor extends Component {
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

    actions.displayEditor({ editor: 'articleType', status: false });
    actions.displayEditor({ editor: 'articleTypes', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    const { update } = values;

    actions.displayEditor({ editor: 'articleType', status: false });
    actions.displayEditor({ editor: 'articleTypes', status: false });
    !update
      ? actions.createArticleType(values)
      : actions.updateArticleType(values);
  }

  get nameInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Article Type Name</Popover.Title>
        <Popover.Content>
          The article type name has to be unique from any other article type and
          can only contain letters, numbers, and dashes. This field
          automatically filters incorrect characters.
        </Popover.Content>
      </Popover>
    );
  }

  get summaryInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Summary</Popover.Title>
        <Popover.Content>
          The Summary field allows you to provide an introductory paragraph, for
          article lists and preview pages. This option also provides an option
          to display the summary as the introductory paragraph on the article's
          display page.
        </Popover.Content>
      </Popover>
    );
  }

  get displaySummaryInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Display Summary</Popover.Title>
        <Popover.Content>
          Display the Summary text before the Text on the article display page.
        </Popover.Content>
      </Popover>
    );
  }

  get statusInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Use Statuses</Popover.Title>
        <Popover.Content>
          Statuses allow articles to be saved as drafts, private, published,
          etc. This option also provides an option to update an article's
          "created date" to when its status is changed to published.
        </Popover.Content>
      </Popover>
    );
  }

  get publishedDateInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Use Published Date</Popover.Title>
        <Popover.Content>
          When an article's status is changed to published, the "created date"
          isn't updated, instead an additional "updated date" is added. This
          option overrides the "created date" to when an article is published.
        </Popover.Content>
      </Popover>
    );
  }

  get setDateInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Set Date and Time</Popover.Title>
        <Popover.Content>
          The "created date" is set automatically when an article is created.
          This option allows you to set the date and time an article will be
          published.
        </Popover.Content>
      </Popover>
    );
  }

  get slugInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">URL Identifier</Popover.Title>
        <Popover.Content>
          By default, the URL Identifier is the unique name of the article type.
          This can be overridden here, for instance if you have a "pages"
          article type, you may want the URL Identifier to be "page".
        </Popover.Content>
      </Popover>
    );
  }

  get urlInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">URL Format</Popover.Title>
        <Popover.Content>
          The URL Format is how links to content are generated in an article
          type. They will use the URL Slug and formatting selected here.
          <br />
          <ul>
            <li>
              Changes here will only be applicable to articles created after the
              change.
            </li>
            <li>
              The selected format has to be supported by a route before it will
              be functional.
            </li>
          </ul>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const { articleType, user } = this.props;

    const { _key, description, name, options, slug, title } = articleType;

    const update = Boolean(articleType?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Article Type` : `Edit ${articleType.title}`}
          </Card.Header>
          <Card.Body>
            <FinalForm
              onSubmit={this.handleSubmit}
              initialValues={{
                _key: _key || null,
                description: description || null,
                name: name || null,
                slug: slug || name || null,
                title: title || null,
                update,
                urlFormat: options?.urlFormat || 'id',
                usePublishedDate: options?.usePublishedDate || false,
                useSetDateAndTime: options?.useSetDateAndTime || false,
                useStatus: options?.useStatus || false,
                useSummary: options?.useSummary || false,
                useSummaryAsIntro: options?.useSummaryAsIntro || false
              }}
              render={({ handleSubmit, submitting, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Row>
                    <Field name="name" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>
                            Unique Name{' '}
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.nameInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info ml-1"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder="e.g. annoucements"
                            isInvalid={meta.error && meta.touched}
                            className="text-lowercase"
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Unique Name
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                    <OnChange name="name">
                      {(value) => {
                        values.name = stringSanitizer.sanitize.addDash(
                          values?.name.toLowerCase()
                        );
                      }}
                    </OnChange>
                  </Form.Row>
                  <Form.Row>
                    <Field name="title" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="3" sm="6">
                          <Form.Label>Article Type Title</Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder="e.g. Announcements"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Article Type Title
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field name="description">
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="6" md="4">
                          <Form.Label>Article Type Description</Form.Label>
                          <Form.Control
                            {...input}
                            as="textarea"
                            placeholder="e.g. purpose, audience, .etc of articles"
                            isInvalid={meta.error && meta.touched}
                          />
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please Enter a Article Type Description
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Field
                      name="urlFormat"
                      component="select"
                      validate={composeValidators(required)}
                    >
                      {({ input, meta }) => (
                        <Form.Group as={Col} sm="6" md="3">
                          <Form.Label>
                            URL Format{' '}
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.urlInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            {...input}
                            isInvalid={meta.error && meta.touched}
                          >
                            <option value="null">Select URL Format</option>
                            <option value="date-id">
                              Date-ID (/{values?.slug || values?.name || 'name'}
                              /yyyy-mm-dd-id)
                            </option>
                            <option value="date-title">
                              Date-Title (/
                              {values?.slug || values?.name || 'name'}
                              /yyyy-mm-dd-title)
                            </option>
                            <option value="id">
                              ID (/{values?.slug || values?.name || 'name'}/id)
                            </option>
                            <option value="id-title">
                              ID-Title (/
                              {values?.slug || values?.name || 'name'}/id-title)
                            </option>
                            <option value="title">
                              Title (/{values?.slug || values?.name || 'name'}
                              /title)
                            </option>
                            <option value="title-id">
                              Title-ID (/
                              {values?.slug || values?.name || 'name'}/title-id)
                            </option>
                          </Form.Control>
                          {meta.touched && meta.error && (
                            <Form.Control.Feedback type="invalid">
                              Please select a URL Format
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group>
                      <Form.Label>Options</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Field name="useSummary" type="checkbox">
                      {({ input, meta }) => (
                        <Fragment>
                          <Form.Check
                            {...input}
                            type="switch"
                            label="Summary"
                            id="options-summary"
                          />
                          <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={this.summaryInfo}
                          >
                            <FontAwesomeIcon
                              className="text-info ml-1"
                              icon={['fas', 'info-circle']}
                              size="1x"
                            />
                          </OverlayTrigger>
                        </Fragment>
                      )}
                    </Field>
                  </Form.Row>
                  {values?.useSummary ? (
                    <Form.Row>
                      <Field name="useSummaryAsIntro" type="checkbox">
                        {({ input, meta }) => (
                          <Fragment>
                            <Form.Check
                              {...input}
                              type="switch"
                              label="Display Summary on Article Page"
                              id="options-displaySummary"
                            />
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.displaySummaryInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info ml-1"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Fragment>
                        )}
                      </Field>
                    </Form.Row>
                  ) : null}
                  <Form.Row>
                    <Field name="useStatus" type="checkbox">
                      {({ input, meta }) => (
                        <Fragment>
                          <Form.Check
                            {...input}
                            type="switch"
                            label="Statuses"
                            id="options-status"
                          />
                          <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={this.statusInfo}
                          >
                            <FontAwesomeIcon
                              className="text-info ml-1"
                              icon={['fas', 'info-circle']}
                              size="1x"
                            />
                          </OverlayTrigger>
                        </Fragment>
                      )}
                    </Field>
                  </Form.Row>
                  {values?.useStatus ? (
                    <Form.Row>
                      <Field name="usePublishedDate" type="checkbox">
                        {({ input, meta }) => (
                          <Fragment>
                            <Form.Check
                              {...input}
                              type="switch"
                              label="Published Date"
                              id="options-usePublishedDate"
                            />
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.publishedDateInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info ml-1"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Fragment>
                        )}
                      </Field>
                    </Form.Row>
                  ) : null}
                  <Form.Row>
                    <Field name="useSetDateAndTime" type="checkbox">
                      {({ input, meta }) => (
                        <Fragment>
                          <Form.Check
                            {...input}
                            type="switch"
                            label="Date Field"
                            id="options-date"
                          />
                          <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={this.setDateInfo}
                          >
                            <FontAwesomeIcon
                              className="text-info ml-1"
                              icon={['fas', 'info-circle']}
                              size="1x"
                            />
                          </OverlayTrigger>
                        </Fragment>
                      )}
                    </Field>
                  </Form.Row>
                  <Form.Row className="mt-3">
                    <Field name="slug">
                      {({ input, meta }) => (
                        <Form.Group as={Col} md="2" sm="4">
                          <Form.Label>
                            URL Slug{' '}
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={this.slugInfo}
                            >
                              <FontAwesomeIcon
                                className="text-info"
                                icon={['fas', 'info-circle']}
                                size="1x"
                              />
                            </OverlayTrigger>
                          </Form.Label>
                          <Form.Control
                            {...input}
                            type="text"
                            placeholder={values?.name || `article-type`}
                            className="text-lowercase"
                          />
                        </Form.Group>
                      )}
                    </Field>
                    <OnChange name="slug">
                      {(value) => {
                        values.slug = stringSanitizer.sanitize.addDash(
                          values?.slug.toLowerCase()
                        );
                      }}
                    </OnChange>
                  </Form.Row>
                  <Form.Row>
                    <Field name="_key">
                      {({ input, meta }) => (
                        <Form.Control {...input} type="hidden" />
                      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ArticleTypeEditor);
