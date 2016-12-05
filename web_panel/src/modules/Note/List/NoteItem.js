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
class NoteItem extends Component {

  static propTypes = {
    note: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  handleEdit = () => {
    const { note } = this.props;
    this.props.pushState(`/note/${note.theme.id}/edit/${note.id}`);
  };

  render() {
    const { note, user } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {note.description}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {note.teacher ? `${note.teacher.sname} ${note.teacher.fname.charAt(0)}.${note.teacher.pname.charAt(0)}.` : 'Автор не указан'}
        </td>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          {moment.unix(note.date_create).format('L')}
        </td>
        {
          user.role === 'ROLE_TEACHER' &&
            <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
              <button type="button" className="btn btn-green" onClick={this.handleEdit}>
                <em className="fa fa-edit"/> Редактировать
              </button>
            </td>
        }
      </tr>
    );
  }
}

export default NoteItem;
