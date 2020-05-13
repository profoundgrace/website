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
import { actions as articlesActions } from 'redux/reducers/articles';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getArticles } from 'redux/selectors/articles';
import DeleteArticleEditor from 'components/Articles/DeleteArticleEditor';
import ArticleEditor from 'components/Articles/ArticleEditor';

export class AdminArticles extends Component {
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
      active: 'Articles'
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestArticles({ articleType: null });
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'deleteArticle', status: false });
    actions.displayEditor({ editor: 'article', status: false });
    actions.displayEditor({ editor: 'articles', status: false });
  }

  articlesEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'articles',
      status: !displayEditor.articles
    });
  }

  articleEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'article', status: _key });
  }

  deleteArticleEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deleteArticle', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Articles Admin" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Articles</h2>
        {user?.privileges?.articles_update && !displayEditor?.articles && (
          <Button
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.articlesEditor()}
            title={`Create a New Article`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add an Article
          </Button>
        )}
        {user?.privileges?.articles_update &&
          displayEditor?.articles === true && <ArticleEditor />}
        <Row className="mt-3">
          <Col>
            {user?.privileges?.articles_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Administration</th>
                    <th>Type</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.map((article, index) => {
                    const {
                      _key,
                      articleType: { name },
                      createdDate,
                      /*updatedDate,*/
                      title,
                      slug
                    } = article;

                    return (
                      <Fragment key={`articles_${_key}`}>
                        <tr>
                          <td className="text-center">
                            {user?.privileges?.articles_update && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() => this.articleEditor(_key)}
                                title={`Edit ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'edit']}
                                  size="1x"
                                />
                              </Button>
                            )}{' '}
                            {user?.privileges?.articles_delete && (
                              <Button
                                variant="danger"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() => this.deleteArticleEditor(_key)}
                                title={`Delete ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'trash-alt']}
                                  size="1x"
                                />
                              </Button>
                            )}
                          </td>
                          <td className="text-center">{name}</td>
                          <td className="text-center">{_key}</td>
                          <td className="text-center">{createdDate}</td>
                          <td className="text-center">{title}</td>
                          <td className="text-center">{slug}</td>
                        </tr>
                        {user?.privileges?.articles_update &&
                          displayEditor?.article === _key && (
                            <tr>
                              <td colSpan="7">
                                <ArticleEditor article={article} />
                              </td>
                            </tr>
                          )}
                        {user?.privileges?.articles_delete &&
                          displayEditor?.deleteArticle === _key && (
                            <tr>
                              <td colSpan="8">
                                <DeleteArticleEditor article={article} />
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
                <h5>No Articles Available</h5>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getArticles(state),
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...articlesActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminArticles);
