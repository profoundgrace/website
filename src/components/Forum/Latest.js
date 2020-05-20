import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actions as authActions } from 'redux/reducers/auth';
import { actions as forumActions } from 'redux/reducers/forum';
import { getCurrentUser } from 'redux/selectors/auth';
import { getLatestTopics } from 'redux/selectors/forum';

export class LatestTopics extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    forum: PropTypes.string,
    bg: PropTypes.string,
    collection: PropTypes.array,
    color: PropTypes.string,
    user: PropTypes.object
  };

  static defaultProps = {
    forum: null,
    bg: 'light',
    color: 'dark'
  };

  componentDidMount() {
    const { actions, forum } = this.props;

    actions.requestLatestTopics({ forum });
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
        <h4>Latest Topics</h4>
        <Row className="mt-3">
          <Col>
            {user?.privileges?.forum_topics_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Fragment>
                {collection.map((topic, index) => {
                  const { _key, forum, created, title, updated } = topic;

                  return (
                    <ListGroup variant="flush" key={`topics_${_key}`}>
                      <ListGroup.Item className="mb-2">
                        <Row>
                          <Col md="auto">
                            <h6>{forum?.title}</h6>
                          </Col>
                          <Col md="auto">
                            <h4>
                              <Link to={`/forum/${forum.name}/${_key}`}>
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
                            {topic?.user?.username}
                          </Col>
                          <Col md="auto">
                            <FontAwesomeIcon
                              icon={['far', 'calendar']}
                              color="gray"
                            />{' '}
                            {this.displayDate(created)}{' '}
                            {this.displayTime(created)}
                          </Col>
                          <Col md="auto">
                            {updated ? (
                              <Fragment>
                                <FontAwesomeIcon
                                  icon={['fas', 'user-edit']}
                                  color="gray"
                                />{' '}
                                {this.displayDate(updated)}{' '}
                                {this.displayTime(updated)}
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
                <h5>No Topics Available</h5>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getLatestTopics(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...forumActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(LatestTopics);
