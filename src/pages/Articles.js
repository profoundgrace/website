import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as articlesActions } from 'redux/reducers/articles';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getArticles, getArticlesLoading } from 'redux/selectors/articles';
import DeleteArticleEditor from 'components/Articles/DeleteArticleEditor';
import ArticleEditor from 'components/Articles/ArticleEditor';
import Loading from 'components/Loading';

export class Articles extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    displayEditor: PropTypes.object,
    loading: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      links: [],
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

  displayDate(date) {
    const dateObject = new Date(date);
    return dateObject.toDateString();
  }

  displayTime(date) {
    const dateObject = new Date(date);
    return dateObject.toLocaleTimeString('en-US');
  }

  render() {
    const { collection, displayEditor, loading, user } = this.props;
    const { active, links } = this.state;

    return (
      <Container fluid>
        <Helmet title="Articles" />

        <h1>Articles</h1>

        <Breadcrumbs base={null} links={links} active={active} />

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
            {!loading && collection?.map ? (
              <Fragment>
                {user?.privileges?.articles_view && collection.length > 0 ? (
                  <Fragment>
                    {collection.map((article, index) => {
                      const {
                        _key,
                        articleType,
                        createdDate,
                        slug,
                        summary,
                        text,
                        title,
                        updatedDate
                      } = article;

                      return (
                        <Fragment key={`articles_${_key}`}>
                          {article?.status === '1' ? (
                            <ListGroup variant="flush">
                              <ListGroup.Item className="mb-2">
                                <Row>
                                  <Col md="auto">
                                    <h4>
                                      <Link to={`/${articleType.slug}/${slug}`}>
                                        {title}
                                      </Link>
                                    </h4>
                                  </Col>

                                  <Col md="auto">
                                    <h6>
                                      <Link
                                        to={`/articles/${articleType.slug}`}
                                      >
                                        {articleType?.title}
                                      </Link>
                                    </h6>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col md="auto">
                                    <FontAwesomeIcon
                                      icon={['fas', 'user-circle']}
                                      color="gray"
                                    />{' '}
                                    {article?.user?.username}
                                  </Col>
                                  <Col md="auto">
                                    <FontAwesomeIcon
                                      icon={['far', 'calendar']}
                                      color="gray"
                                    />{' '}
                                    {this.displayDate(createdDate)}{' '}
                                    {this.displayTime(createdDate)}
                                  </Col>
                                  <Col md="auto">
                                    {updatedDate ? (
                                      <Fragment>
                                        <FontAwesomeIcon
                                          icon={['fas', 'user-edit']}
                                          color="gray"
                                        />{' '}
                                        {this.displayDate(updatedDate)}{' '}
                                        {this.displayTime(updatedDate)}
                                      </Fragment>
                                    ) : null}
                                  </Col>
                                  <Col className="text-right">
                                    {user?.privileges?.articles_update && (
                                      <Button
                                        variant="light"
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
                                        variant="light"
                                        size="sm"
                                        className="mr-2 rounded-circle"
                                        onClick={() =>
                                          this.deleteArticleEditor(_key)
                                        }
                                        title={`Delete ${title}`}
                                      >
                                        <FontAwesomeIcon
                                          icon={['fas', 'trash-alt']}
                                          size="1x"
                                        />
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className="pt-3">
                                    {summary
                                      ? summary
                                      : unified()
                                          .use(parse)
                                          .use(remark2react)
                                          .processSync(text).result}
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                              {user?.privileges?.articles_update &&
                                displayEditor?.article === _key && (
                                  <ListGroup.Item className="mb-2">
                                    <ArticleEditor article={article} />
                                  </ListGroup.Item>
                                )}
                              {user?.privileges?.articles_delete &&
                                displayEditor?.deleteArticle === _key && (
                                  <ListGroup.Item className="mb-2">
                                    <DeleteArticleEditor article={article} />
                                  </ListGroup.Item>
                                )}
                            </ListGroup>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </Fragment>
                ) : (
                  <Container className="text-center">
                    <h5>No Articles Available</h5>
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
  collection: getArticles(state),
  displayEditor: getEditorStatus(state),
  loading: getArticlesLoading(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Articles);
