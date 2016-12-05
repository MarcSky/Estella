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
class CourseworkDetailItem extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    teachers: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    coursework: PropTypes.object.isRequired
  };

  handleClick = () => {
    const {theme} = this.props;
    this.props.pushState(`/theme/detail/${theme.id}`);
  };

  handleEdit = () => {
    const {theme, coursework} = this.props;
    this.props.pushState(`/theme/${coursework.id}/edit/${theme.id}`);
  };

  render() {
    const { theme, teachers, end, group } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td onClick={this.handleClick} className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          <h5>
            {theme.name}
          </h5>
        </td>
        <td onClick={this.handleClick} className={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
        {
           teachers && teachers.map((item) =>
               <p className={`${styles.pName}`} key={item.id}>{item.sname} {item.fname.charAt(0)}.{item.pname.charAt(0)}.</p>)
        }
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          { theme.student ? `${theme.student.fname} ${theme.student.sname}` : 'Свободная тема' }
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {group ? group.name : 'Не указано'}
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {moment.unix(end).format('L')}
        </td>
        <td onClick={this.handleEdit} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <button type="button" className="btn btn-primary">
            <em className="fa fa-pencil-square-o" />
          </button>
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <button type="button" className="btn btn-danger">
            <em className="fa fa-times" />
          </button>
        </td>
      </tr>
    );
  }
}

export default CourseworkDetailItem;
