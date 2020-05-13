import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as articlesActions } from 'redux/reducers/articles';
import { getCurrentUser } from 'redux/selectors/auth';
import { getArticles } from 'redux/selectors/articles';

export class LatestArticles extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    articleType: PropTypes.string,
    bg: PropTypes.string,
    collection: PropTypes.array,
    color: PropTypes.string,
    user: PropTypes.object
  };

  static defaultProps = {
    articleType: null,
    bg: 'light',
    color: 'dark'
  };

  componentDidMount() {
    const { actions, articleType } = this.props;

    actions.requestArticles({ articleType });
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
    const { bg, collection, color, user } = this.props;
    return (
      <Container fluid className={`bg bg-${bg} text-${color} pt-3`}>
        <h4>Latest Articles</h4>
        <Row className="mt-3">
          <Col>
            {user?.privileges?.articles_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Fragment>
                {collection.map((article, index) => {
                  const {
                    _key,
                    articleType,
                    createdDate,
                    slug,
                    title,
                    updatedDate
                  } = article;

                  return (
                    <ListGroup variant="flush" key={`articles_${_key}`}>
                      <ListGroup.Item className="mb-2">
                        <Row>
                          <Col md="auto">
                            <h6>{articleType?.title}</h6>
                          </Col>
                          <Col md="auto">
                            <h4>
                              <Link to={`/${articleType.slug}/${slug}`}>
                                {title}
                              </Link>
                            </h4>
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
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  );
                })}
              </Fragment>
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
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...articlesActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(LatestArticles);
