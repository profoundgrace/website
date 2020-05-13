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
import { actions as articleTypesActions } from 'redux/reducers/articleTypes';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getArticleTypes } from 'redux/selectors/articleTypes';
import DeleteArticleTypeEditor from 'components/Articles/DeleteArticleTypeEditor';
import ArticleTypeEditor from 'components/Articles/ArticleTypeEditor';

export class AdminArticleTypes extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      links: [{ name: 'Admin', url: '/admin' }],
      active: 'Article Types'
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestArticleTypes();
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'deleteArticleType', status: false });
    actions.displayEditor({ editor: 'articleType', status: false });
    actions.displayEditor({ editor: 'articleTypes', status: false });
  }

  articleTypesEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'articleTypes',
      status: !displayEditor.articleTypes
    });
  }

  articleTypeEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'articleType', status: _key });
  }

  deleteArticleTypeEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteArticleType', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Article Types Admin" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Article Types</h2>
        {user?.privileges?.article_types_update &&
          !displayEditor?.articleTypes && (
            <Button
              size="sm"
              className="mr-2 mt-2 rounded-pill"
              onClick={() => this.articleTypesEditor()}
              title={`Create a New Article Type`}
            >
              <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
              &nbsp; Add a Article Type
            </Button>
          )}
        {user?.privileges?.article_types_update &&
          displayEditor?.articleTypes === true && <ArticleTypeEditor />}
        <Row className="mt-3">
          <Col>
            {user?.privileges?.article_types_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Administration</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>URL Format</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.map((articleType, index) => {
                    const {
                      _key,
                      description,
                      name,
                      options,
                      slug,
                      title,
                      urlFormat
                    } = articleType;

                    return (
                      <Fragment key={`article_types_${_key}`}>
                        <tr>
                          <td className="text-center">
                            {user?.privileges?.article_types_update && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() => this.articleTypeEditor(_key)}
                                title={`Edit ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'edit']}
                                  size="1x"
                                />
                              </Button>
                            )}{' '}
                            {user?.privileges?.article_types_delete && (
                              <Button
                                variant="danger"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() =>
                                  this.deleteArticleTypeEditor(_key)
                                }
                                title={`Delete ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'trash-alt']}
                                  size="1x"
                                />
                              </Button>
                            )}
                          </td>
                          <td className="text-center">{title}</td>
                          <td className="text-left">{description}</td>
                          <td className="text-center">{name}</td>
                          <td className="text-center">{slug}</td>
                          <td className="text-center">{urlFormat}</td>
                          <td className="text-left">
                            <pre>{JSON.stringify(options, 0, 2)}</pre>
                          </td>
                        </tr>
                        {user?.privileges?.article_types_update &&
                          displayEditor?.articleType === _key && (
                            <tr>
                              <td colSpan="7">
                                <ArticleTypeEditor articleType={articleType} />
                              </td>
                            </tr>
                          )}
                        {user?.privileges?.article_types_delete &&
                          displayEditor?.deleteArticleType === _key && (
                            <tr>
                              <td colSpan="8">
                                <DeleteArticleTypeEditor
                                  articleType={articleType}
                                />
                              </td>
                            </tr>
                          )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <Container className="text-center">
                <h5>No Article Types Available</h5>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getArticleTypes(state),
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...articleTypesActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminArticleTypes);
