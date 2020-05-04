import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export class Breadcrumbs extends Component {
  static propTypes = {
    base: PropTypes.string,
    links: PropTypes.array,
    active: PropTypes.string
  };

  basePath(base){
    switch(base){
      case 'bible':
        return(
          <Fragment>
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bible">Holy Bible</Link>
            </li>
          </Fragment>
        );
      case 'ot':
        return(
          <Fragment>
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bible">Holy Bible</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bible/ot">Old Testament</Link>
            </li>
          </Fragment>
        );
      case 'nt':
        return(
          <Fragment>
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bible">Holy Bible</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/bible/nt">New Testament</Link>
            </li>
          </Fragment>
        );
      default:
        return(
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
        )
    }
  }

  render() {
    const { active, base, links } = this.props;
    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {this.basePath(base)}
          {links && links.map((item, index) => {
            return(
              <li key={index} className="breadcrumb-item">
                <Link to={item.url}>{item.name}</Link>
              </li>
            )
          })}
          <li className="breadcrumb-item active" aria-current="page">
            <span className="active">{active}</span>
          </li>
        </ol>
      </nav>
    )
  }

  Item(){
    return 'yes';
  }
}

export default Breadcrumbs;
