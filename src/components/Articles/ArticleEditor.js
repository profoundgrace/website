import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { Form as FinalForm, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as articlesActions } from 'redux/reducers/articles';
import { actions as articleTypesActions } from 'redux/reducers/articleTypes';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getArticleTypes } from 'redux/selectors/articleTypes';
import { getEditorStatus } from 'redux/selectors/editor';
import { composeValidators, required } from 'utils/validation';

export class ArticleEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    articleTypes: PropTypes.array,
    displayEditor: PropTypes.object,
    article: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };
  static defaultProps = {
    article: {},
    articleTypes: []
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideEditor = this.hideEditor.bind(this);
    this.selectArticleType = this.selectArticleType.bind(this);
    this.state = { articleType: {} };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestArticleTypes();
  }

  hideEditor() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'article', status: false });
    actions.displayEditor({ editor: 'articles', status: false });
  }

  handleSubmit(values) {
    const { actions } = this.props;
    const { update } = values;

    actions.displayEditor({ editor: 'article', status: false });
    actions.displayEditor({ editor: 'articles', status: false });
    !update ? actions.createArticle(values) : actions.updateArticle(values);
  }

  selectArticleType(articleType) {
    this.setState({ articleType });
  }

  setDate(date, time) {
    return new Date(`${date} ${time}`);
  }

  get textInfo() {
    return (
      <Popover>
        <Popover.Title as="h3">Markdown</Popover.Title>
        <Popover.Content>
          This content supports{' '}
          <a
            href="https://daringfireball.net/projects/markdown/syntax"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown
          </a>
          , if you don't want to just use plain text.
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const { article, user, articleTypes } = this.props;
    const { articleType } = article?.articleType ? article : this.state;
    const { options } = articleType;
    const {
      _key,
      articleTypeId,
      createdDate,
      slug,
      status,
      summary,
      text,
      title,
      updatedDate,
      userId
    } = article;

    const update = Boolean(article?._key);

    return (
      <Col className="mt-3">
        <Card>
          <Card.Header as="h5">
            {!update ? `Add New Article` : `Edit ${article.title}`}
          </Card.Header>
          <Card.Body>
            {!articleTypeId ? (
              <Fragment>
                {articleTypes && <h6>Select an Article Type</h6>}
                {articleTypes &&
                  articleTypes.map((contentType) => {
                    const border =
                      articleType?._key === contentType?._key
                        ? 'success'
                        : 'light';

                    return (
                      <Button
                        variant="light"
                        className="mr-2 mt-2"
                        key={`articleType_${contentType._key}`}
                        onClick={() => this.selectArticleType(contentType)}
                      >
                        <Card body bg="light" border={border}>
                          <h6>{contentType.title}</h6>
                        </Card>
                      </Button>
                    );
                  })}
              </Fragment>
            ) : null}
            {articleTypeId || articleType?._key ? (
              <Fragment>
                <hr />
                <FinalForm
                  onSubmit={this.handleSubmit}
                  initialValues={{
                    _key: _key || null,
                    articleTypeId: articleTypeId || articleType._key || null,
                    createdDate: createdDate || null,
                    slug: slug || null,
                    slugFormat: articleType.urlFormat,
                    status: status || null,
                    summary: summary || null,
                    text: text || null,
                    title: title || null,
                    update,
                    updatedDate: updatedDate || null,
                    userId: userId || user.id
                  }}
                  render={({ handleSubmit, submitting, values }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Row>
                        <Field
                          name="title"
                          validate={composeValidators(required)}
                        >
                          {({ input, meta }) => (
                            <Form.Group as={Col} md="4" sm="8">
                              <Form.Label>Title</Form.Label>
                              <Form.Control
                                {...input}
                                type="text"
                                isInvalid={meta.error && meta.touched}
                              />
                              {meta.touched && meta.error && (
                                <Form.Control.Feedback type="invalid">
                                  Please Enter an Article Title
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          )}
                        </Field>
                      </Form.Row>
                      {options?.useSummary ? (
                        <Form.Row>
                          <Field name="summary">
                            {({ input, meta }) => (
                              <Form.Group as={Col} sm="6" md="4">
                                <Form.Group>
                                  <Form.Label>Summary</Form.Label>
                                  <Form.Control
                                    {...input}
                                    as="textarea"
                                    isInvalid={meta.error && meta.touched}
                                  />
                                  {meta.touched && meta.error && (
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter an Article Introduction
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                              </Form.Group>
                            )}
                          </Field>
                        </Form.Row>
                      ) : null}
                      <Form.Row>
                        <Field
                          name="text"
                          validate={composeValidators(required)}
                        >
                          {({ input, meta }) => (
                            <Form.Group as={Col} sm="12" md="4">
                              <Form.Label>
                                Text{' '}
                                <OverlayTrigger
                                  trigger="click"
                                  placement="right"
                                  overlay={this.textInfo}
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
                                as="textarea"
                                rows="10"
                                isInvalid={meta.error && meta.touched}
                              />
                              {meta.touched && meta.error && (
                                <Form.Control.Feedback type="invalid">
                                  Please Enter Article Text
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          )}
                        </Field>
                      </Form.Row>
                      {values?.text ? (
                        <Fragment>
                          <h6>Preview:</h6>
                          <Form.Row>
                            <Col
                              sm="12"
                              md="4"
                              className="p-3 border border-light text-break"
                            >
                              {
                                unified()
                                  .use(parse)
                                  .use(remark2react)
                                  .processSync(values.text).result
                              }
                            </Col>
                          </Form.Row>
                        </Fragment>
                      ) : null}
                      {options?.useStatus ? (
                        <Form.Row>
                          <Field
                            name="status"
                            component="select"
                            validate={composeValidators(required)}
                          >
                            {({ input, meta }) => (
                              <Form.Group as={Col} sm="3" md="2">
                                <Form.Label>
                                  Status{' '}
                                  <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={this.statusInfo}
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
                                  <option value="null">Select Status</option>
                                  <option value="1">Published</option>
                                  <option value="2">Draft</option>
                                  <option value="3">Private</option>
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
                      ) : null}
                      {options?.useSetDateAndTime && values?.status === '1' ? (
                        <Fragment>
                          <Form.Row>
                            <Field name="date">
                              {({ input, meta }) => (
                                <Form.Group as={Col} md="2" sm="4">
                                  <Form.Label>Date</Form.Label>
                                  <Form.Control
                                    {...input}
                                    type="date"
                                    className="text-lowercase"
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <OnChange name="date">
                              {(value) => {
                                values.createdDate =
                                  values?.time &&
                                  values?.time.length === 5 &&
                                  values.date &&
                                  values?.date.length === 10
                                    ? this.setDate(values?.date, values?.time)
                                    : null;
                              }}
                            </OnChange>
                            <Field name="time">
                              {({ input, meta }) => (
                                <Form.Group as={Col} md="2" sm="4">
                                  <Form.Label>Time</Form.Label>
                                  <Form.Control
                                    {...input}
                                    type="time"
                                    className="text-lowercase"
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <OnChange name="time">
                              {(value) => {
                                values.createdDate =
                                  values?.time &&
                                  values?.time.length === 5 &&
                                  values.date &&
                                  values?.date.length === 10
                                    ? this.setDate(values?.date, values?.time)
                                    : null;
                              }}
                            </OnChange>
                          </Form.Row>
                          <Col
                            className="alert alert-info md-auto"
                            md="4"
                            sm="6"
                          >
                            {values?.date && values?.time
                              ? `Published date will be set to ${this.setDate(
                                  values?.date,
                                  values?.time
                                ).toLocaleString()}`
                              : 'Article will be published immediately'}
                          </Col>
                        </Fragment>
                      ) : null}
                      {slug ? (
                        <Form.Row>
                          <Field
                            name="slug"
                            validate={composeValidators(required)}
                          >
                            {({ input, meta }) => (
                              <Fragment>
                                <Col md="12" sm="12">
                                  <label htmlFor="article-slug">Slug</label>
                                </Col>
                                <InputGroup as={Col} md="4" sm="8">
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>
                                      /{articleType.slug}/
                                    </InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <Form.Control
                                    {...input}
                                    id="article-slug"
                                    type="text"
                                    isInvalid={meta.error && meta.touched}
                                    className="text-lowercase"
                                  />
                                  {meta.touched && meta.error && (
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter a Unique URL Slug
                                    </Form.Control.Feedback>
                                  )}
                                </InputGroup>
                              </Fragment>
                            )}
                          </Field>
                          <OnChange name="slug">
                            {(value) => {
                              values.updatedSlug = true;
                            }}
                          </OnChange>
                        </Form.Row>
                      ) : null}
                      <Field name="_key">
                        {({ input, meta }) => (
                          <Form.Control {...input} type="hidden" />
                        )}
                      </Field>
                      <Field name="createdDate">
                        {({ input, meta }) => (
                          <Form.Control {...input} type="hidden" />
                        )}
                      </Field>
                      <Field name="slugFormat">
                        {({ input, meta }) => (
                          <Form.Control {...input} type="hidden" />
                        )}
                      </Field>
                      <Form.Row className="mt-3">
                        <Form.Group>
                          <ButtonGroup>
                            <Button
                              variant="outline-success"
                              type="submit"
                              disabled={submitting}
                            >
                              <FontAwesomeIcon
                                icon={['far', 'save']}
                                size="lg"
                              />
                              &nbsp;<span>Save</span>
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => this.hideEditor()}
                            >
                              <FontAwesomeIcon
                                icon={['fas', 'ban']}
                                size="lg"
                              />
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
              </Fragment>
            ) : null}
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  articleTypes: getArticleTypes(state),
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...articlesActions,
      ...articleTypesActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEditor);
