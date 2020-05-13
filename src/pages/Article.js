import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as editorActions } from 'redux/reducers/editor';
import { actions as articlesActions } from 'redux/reducers/articles';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getArticle, getArticlesLoading } from 'redux/selectors/articles';
import DeleteArticleEditor from 'components/Articles/DeleteArticleEditor';
import ArticleEditor from 'components/Articles/ArticleEditor';
import Loading from 'components/Loading';

export class Articles extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    article: PropTypes.array,
    displayEditor: PropTypes.object,
    loading: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      links: [{ name: 'Articles', url: '/articles' }],
      active: ''
    };
  }

  componentDidMount() {
    const {
      actions,
      match: {
        params: { articleType, article }
      }
    } = this.props;

    actions.requestArticle({ articleType, article });
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
    const { article, displayEditor, loading, user } = this.props;
    let { active, links } = this.state;
    const {
      _key,
      articleType,
      createdDate,
      text,
      title,
      updatedDate
    } = article;
    links = [
      ...links,
      { name: articleType?.title, url: `articles/${articleType?.slug}` }
    ];
    return (
      <Container fluid>
        <Helmet title={`${title} | ${articleType?.title}`} />
        <h1>{articleType?.title}</h1>
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
            {!loading ? (
              <Fragment>
                {user?.privileges?.articles_view && article ? (
                  <Fragment>
                    <h4>{title}</h4>
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
                            <FontAwesomeIcon icon={['fas', 'edit']} size="1x" />
                          </Button>
                        )}{' '}
                        {user?.privileges?.articles_delete && (
                          <Button
                            variant="light"
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
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pt-3">
                        {
                          unified()
                            .use(parse)
                            .use(remark2react)
                            .processSync(text).result
                        }
                      </Col>
                    </Row>
                    {user?.privileges?.articles_update &&
                      displayEditor?.article === _key && (
                        <ArticleEditor article={article} />
                      )}
                    {user?.privileges?.articles_delete &&
                      displayEditor?.deleteArticle === _key && (
                        <DeleteArticleEditor article={article} />
                      )}
                  </Fragment>
                ) : (
                  <Container className="text-center">
                    <h5>No Article Available</h5>
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
  article: getArticle(state),
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
