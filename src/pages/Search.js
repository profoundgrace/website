import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
//import { Link } from 'react-router-dom';
import { Button, Container, Form} from 'react-bootstrap';
import { actions as booksActions } from 'redux/reducers/books';
import { getBooks } from 'redux/selectors/books';
import { Breadcrumbs } from 'components/Breadcrumbs';

export class Search extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    collection: PropTypes.array,
    match: PropTypes.object
  };

  constructor(props){
    super(props);
    this.state = {
      submitting: false,
      submitted: false,
      query: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestBooks();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submitForm = (e) => {
    this.setState({ submitting: true });
    e.preventDefault();
    const { name } = this.state;
    fetch('api/mailer', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then((res) => {
      if(res.status === 200){
        this.setState({ submitted: true })
      }
    })
  }

  render() {
    const { query } = this.state;
    const isSubmitting = this.state.submitting;

    let button;

    if (isSubmitting) {
      button = <Button variant="info">Searching...</Button>;
    } else {
      button = <Button type="submit">Search</Button>;
    }
    
    return (
      <Fragment>
        <Container>
          <Helmet title="Bible Search" />
          <h1>Bible</h1>
          <Breadcrumbs 
            links={[{name: "Holy Bible", url: "/bible"}]}
            active="Search"
          />
          <Form inline onSubmit={this.submitForm}>
            <Form.Control
              type="text"
              name="query"
              placeholder="Search"
              value={query}
              onChange={this.handleInputChange}
              className="mr-sm-2"
              required
            />
            {button}
          </Form>
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  collection: getBooks(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...booksActions }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
