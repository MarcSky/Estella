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
class CourseworkListItem extends Component {

  static propTypes = {
    coursework: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleClick = () => {
    const {coursework} = this.props;
    this.props.pushState(`/coursework/detail/${coursework.id}`);
  };

  handleEdit = () => {
    const { coursework } = this.props;
    this.props.pushState(`/coursework/edit/${coursework.id}`);
  };

  render() {
    const { coursework } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td onClick={this.handleClick} className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          <h5>
            {coursework.name}
          </h5>
        </td>
        <td onClick={this.handleClick} className={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
          {
             coursework.teachers && coursework.teachers.map((item) =>
                 <p className={`${styles.pName}`} key={item.id}>{item.sname} {item.fname.charAt(0)}.{item.pname.charAt(0)}.</p>)
         }
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {coursework.group ? coursework.group.name : 'Отсутствует'}
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {coursework.tcount}
        </td>
        <td onClick={this.handleClick} className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {moment.unix(coursework.end).format('L')}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <button type="button" className="btn btn-primary" onClick={this.handleEdit}>
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

export default CourseworkListItem;
