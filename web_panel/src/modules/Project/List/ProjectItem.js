import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import moment from 'moment';
require('moment/locale/ru');
moment.locale('ru');

@connect(
  null,
  {pushState: routeActions.push}
)
class ProjectItem extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  handleView = () => {
    const { theme } = this.props;
    this.props.pushState(`/theme/detail/${theme.id}`);
  };

  handleEdit = () => {
    const { theme } = this.props;
    this.props.pushState(`/result/${theme.id}`);
  };

  render() {
    const { theme } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          <h5>
            {theme.coursework.name}
          </h5>
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {theme.name}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {theme.ncount}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {moment.unix(theme.coursework.end).format('L')}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
        {
           theme.coursework.teachers && theme.coursework.teachers.map((item) =>
               <p className={`${styles.pName}`} key={item.id}>{item.sname} {item.fname.charAt(0)}.{item.pname.charAt(0)}.</p>)
        }
        </td>
        <td сlassName={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
          <button type="button" className="btn btn-green" onClick={this.handleEdit}>
            <em className="fa fa-pencil-square-o" /> Открыть
          </button>
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
          <button type="button" className="btn btn-primary" onClick={this.handleView}>
            <em className="fa fa-pencil-square-o" /> Открыть
          </button>
        </td>
      </tr>
    );
  }
}

export default ProjectItem;
