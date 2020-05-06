import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner
} from 'react-bootstrap';
import { actions as searchActions } from 'redux/reducers/search';
import {
  getSearchInfo,
  getSearchLoading,
  getSearchQuery,
  getSearchResult
} from 'redux/selectors/search';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { composeValidators, required } from 'utils/validation';
import qs from 'querystringify';

export class Search extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    info: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object,
    query: PropTypes.string,
    results: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    const queryParams = this.queryParams;
    if (queryParams?.q) {
      if (!queryParams?.p) {
        queryParams.p = 1;
      }
      actions.requestSearch({ query: queryParams.q, page: queryParams.p });
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  handleSubmit(values) {
    const { actions } = this.props;

    actions.requestSearch(values);
  }

  get queryParams() {
    const {
      location: { search }
    } = this.props;
    return qs.parse(search);
  }

  get pager() {
    const {
      info: { pages, page },
      query
    } = this.props;
    const queryParams = this.queryParams;
    let active = page || queryParams?.p || 1;
    let items = [];
    for (let number = 1; number <= pages; number++) {
      items.push(
        <Pagination.Item
          as={Link}
          key={number}
          active={number === active}
          to={`/search/?q=${query}&p=${number}`}
          onClick={() => this.navigatePager(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  }

  navigatePager(page) {
    const { actions, query } = this.props;

    if (this.queryParams.p !== page) {
      actions.requestSearch({ query, page });
    }
  }

  render() {
    const {
      info: { count, executionTime, page, pages },
      loading,
      query,
      result
    } = this.props;

    const queryParams = this.queryParams;
    return (
      <Container fluid>
        <Helmet title="Bible Search" />
        <h1>Bible</h1>
        <Breadcrumbs
          links={[{ name: 'Holy Bible', url: '/bible' }]}
          active="Search"
        />
        <FinalForm
          onSubmit={this.handleSubmit}
          initialValues={{
            query: query || queryParams.q || '',
            page: queryParams?.p || 1
          }}
          render={({ form, handleSubmit, submitting, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Row>
                <Col md={{ offset: 3, span: 6 }}>
                  <Field name="query" validate={composeValidators(required)}>
                    {({ input, meta }) => (
                      <InputGroup>
                        <Form.Control
                          {...input}
                          type="text"
                          placeholder="Search"
                          aria-label="Search"
                          isInvalid={meta.error && meta.touched}
                        />
                        {values?.query ? (
                          <InputGroup.Append>
                            {loading ? (
                              <Button variant="light">
                                <Spinner
                                  animation="border"
                                  variant="success"
                                  size="sm"
                                />
                              </Button>
                            ) : (
                              <Button variant="outline-success" type="submit">
                                Search
                              </Button>
                            )}

                            {/*<Button
                              variant="outline-danger"
                              type="reset"
                              onClick={() => form.reset()}
                            >
                              Reset
                            </Button>*/}
                          </InputGroup.Append>
                        ) : null}
                        {meta.touched && meta.error && (
                          <Form.Control.Feedback type="invalid">
                            Please Enter Search Terms
                          </Form.Control.Feedback>
                        )}
                      </InputGroup>
                    )}
                  </Field>
                  <Field name="page">
                    {({ input, meta }) => (
                      <Form.Control {...input} type="hidden" />
                    )}
                  </Field>
                </Col>
              </Form.Row>
              {/*
              <Fragment>
                Debug: <pre>{JSON.stringify(values, 0, 2)}</pre>
              </Fragment>
              */}
            </Form>
          )}
        />
        {result?.map && result.length > 0 ? (
          <Fragment>
            <h4>Search Results for "{query}"</h4>
            <Row className="mb-2">
              <Col>
                Found {count} results in {executionTime.toFixed(5)} seconds.
              </Col>
              <Col className="text-right">
                Page {page} / {pages}
              </Col>
            </Row>
            {result.map((verse, index) => {
              return (
                <Card className="mb-2">
                  <Card.Header>
                    <Link to={`/bible/${verse.slug}/${verse.ch}`}>
                      {verse.book} {verse.ch}:{verse.ver}
                    </Link>
                  </Card.Header>
                  <Card.Body>{verse.txt}</Card.Body>
                </Card>
              );
            })}
          </Fragment>
        ) : null}
        {result.length === 0 && executionTime ? (
          <Card text="info" border="info" className="mt-2 mb-2">
            <Card.Body>
              <Card.Title>No Search Results for "{query}"</Card.Title>
            </Card.Body>
          </Card>
        ) : null}
        {pages && pages > 1 ? (
          <Fragment>
            <Row className="justify-content-md-center mt-4">
              <Col md="auto">
                <Pagination>{this.pager}</Pagination>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>Total: {count}</Col>
              <Col className="text-right">
                Page {page} / {pages}
              </Col>
            </Row>
          </Fragment>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  info: getSearchInfo(state),
  loading: getSearchLoading(state),
  query: getSearchQuery(state),
  result: getSearchResult(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...searchActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
