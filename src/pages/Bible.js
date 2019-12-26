import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import { actions as bookActions } from '../redux/reducers/book';
import { getBookChapter } from '../redux/selectors/book';

export class Bible extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.object
  };
  componentDidMount() {
    const { actions } = this.props;

    actions.requestChapter();
  }
  render() {
    const { collection } = this.props;
    return (
      <Fragment>
        <Container>
          <Helmet title="Bible" />

          <h1>Bible</h1>
          {collection.map((chapter, index) => {
              return (
                <p>
                  <sup>{chapter.verse}</sup> {chapter.text}
                </p>
              );
            })}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collection: getBookChapter(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...bookActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bible);
