import React, {Component, PropTypes} from 'react';
import {Pagination} from 'react-bootstrap';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';

@connect(
  null,
  {pushState: routeActions.push}
)
export default class AbstractPagination extends Component {
  static propTypes = {
    activePage: PropTypes.number.isRequired,
    countItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    pushState: PropTypes.func.isRequired,
    path: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ])
  };

  handleSelect = (event, selectedEvent) => {
    const {path, pushState} = this.props;
    if (typeof path === 'object') {
      pushState({
        pathname: `${path.pathname}/${selectedEvent.eventKey}`,
        query: path.query ? path.query : null
      });
    } else {
      pushState(`${path}/${selectedEvent.eventKey}`);
    }
  };

  render() {
    const { activePage, countItems, itemsPerPage } = this.props;
    const countPage = Math.ceil(countItems / itemsPerPage);
    return (
      <Pagination
        prev
        next
        first
        last
        ellipsis
        items={countPage}
        maxButtons={10}
        activePage={activePage}
        onSelect={this.handleSelect} />
    );
  }
}
