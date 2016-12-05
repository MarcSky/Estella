import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';

@connect(
  null,
  {pushState: routeActions.push}
)
class StudentItem extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleView = () => {
    const { theme } = this.props;
    this.props.pushState(`/result/${theme.id}`);
  };

  render() {
    const { theme } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {theme.name}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {theme.ncount}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <button type="button" className="btn btn-green" onClick={this.handleView}>
            <em className="fa fa-desktop"/> Просмотр
          </button>
        </td>
      </tr>
    );
  }
}

export default StudentItem;
