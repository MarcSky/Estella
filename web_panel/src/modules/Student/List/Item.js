import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
const _ = require('utils/lodash');

@connect(
  null,
  {pushState: routeActions.push}
)
class Item extends Component {
  static propTypes = {
    student: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleView = () => {
    const {student} = this.props;
    this.props.pushState(`/students/detail/${student.id}`);
  };

  render() {
    const { student } = this.props;
    console.log(student);
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.countCol}`}>
          {student.sname}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {student.fname}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {student.pname}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {student.group ? student.group.name : 'Отсутствует'}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {student.subdivision ? student.subdivision.name : 'Отсутствует'}
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          {_.isEmpty(student.themes) ? 'Отсутствует' :
             <button type="button" className="btn btn-green" onClick={this.handleView}>
              Просмотр
             </button>
          }
        </td>
      </tr>
    );
  }
}

export default Item;
