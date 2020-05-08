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
import { actions as pubsActions } from 'redux/reducers/publications';
import { getCurrentUser, isLoggedIn } from 'redux/selectors/auth';
import { getEditorStatus } from 'redux/selectors/editor';
import { getPubTypes } from 'redux/selectors/publications';
import DeletePublicationEditor from 'components/Publications/DeletePublicationEditor';
import PublicationEditor from 'components/Publications/PublicationEditor';

export class AdminPublications extends Component {
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
      active: 'Publication'
    };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.requestPubs();
  }

  disableEditors() {
    const { actions } = this.props;

    actions.displayEditor({ editor: 'deletePublication', status: false });
    actions.displayEditor({ editor: 'publication', status: false });
    actions.displayEditor({ editor: 'publications', status: false });
  }

  publicationsEditor() {
    const { actions, displayEditor } = this.props;
    actions.displayEditor({
      editor: 'publications',
      status: !displayEditor.publications
    });
  }

  publicationEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'publication', status: _key });
  }

  deletePublicationEditor(_key) {
    const { actions } = this.props;
    actions.displayEditor({ editor: 'deletePublication', status: _key });
  }

  render() {
    const { collection, displayEditor, user } = this.props;
    const { active, links } = this.state;
    return (
      <Container fluid>
        <Helmet title="Publications Admin" />
        <h1>Administration</h1>
        <Breadcrumbs base={null} links={links} active={active} />
        <h2>Publications Admin</h2>
        {user?.privileges?.publications_update && !displayEditor?.publications && (
          <Button
            variant="success"
            size="sm"
            className="mr-2 mt-2 rounded-pill"
            onClick={() => this.publicationsEditor()}
            title={`Create a New Publication`}
          >
            <FontAwesomeIcon icon={['fas', 'plus']} size="lg" />
            &nbsp; Add a Publication
          </Button>
        )}
        {user?.privileges?.publications_update &&
          displayEditor?.publications === true && <PublicationEditor />}
        <Row className="mt-3">
          <Col>
            {user?.privileges?.publications_view &&
            collection &&
            collection?.map &&
            collection.length > 0 ? (
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th>Options</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.map((publication, index) => {
                    const { _key, description, name, title } = publication;

                    return (
                      <Fragment key={`publications_${_key}`}>
                        <tr>
                          <td className="text-center">
                            {user?.privileges?.publications_update && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() => this.publicationEditor(_key)}
                                title={`Edit ${title}`}
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'edit']}
                                  size="1x"
                                />
                              </Button>
                            )}{' '}
                            {user?.privileges?.publications_delete && (
                              <Button
                                variant="danger"
                                size="sm"
                                className="mr-2 rounded-circle"
                                onClick={() =>
                                  this.deletePublicationEditor(_key)
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
                        </tr>
                        {user?.privileges?.publications_update &&
                          displayEditor?.publication === _key && (
                            <tr>
                              <td colSpan="7">
                                <PublicationEditor publication={publication} />
                              </td>
                            </tr>
                          )}
                        {user?.privileges?.publications_delete &&
                          displayEditor?.deletePublication === _key && (
                            <tr>
                              <td colSpan="8">
                                <DeletePublicationEditor
                                  publication={publication}
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
                <h5>No Publications Available</h5>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  collection: getPubTypes(state),
  displayEditor: getEditorStatus(state),
  loggedIn: isLoggedIn(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...editorActions,
      ...pubsActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPublications);
