import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';

@connect(
  null,
  {pushState: routeActions.push}
)
class DocumentItem extends Component {

  static propTypes = {
    material: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  handleView = () => {
    const {material} = this.props;
    window.open(material.path, '_blank');
  };

  handleRemove = () => {
    const { material } = this.props;
    console.log(material.id);
  };

  handleDownload = () => {
    const { material } = this.props;
    window.open(material.path);
  };

  render() {
    const { material, user } = this.props;
    const styles = require('modules/style.scss');
    return (
      <tr className={`${styles.rowClient}`}>
        <td className={`text-muted text-center hidden-xs hidden-sm ${styles.nameCol}`}>
          <h5>
            {material.name}
          </h5>
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <div className="btn-group">
            <button type="button" className="btn btn-green" onClick={this.handleDownload}>Скачать</button>
          </div>
        </td>
        <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
          <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={this.handleView}>Просмотр</button>
          </div>
        </td>
        {
          user.role === 'ROLE_TEACHER' &&
            <td className={`text-center hidden-xs hidden-sm ${styles.lastCol}`}>
              <div className="btn-group">
                <button type="button" className="btn btn-danger" onClick={this.handleRemove}>
                  <em className="fa fa-pencil-square-o" />Удалить
                </button>
              </div>
            </td>
        }
      </tr>
    );
  }
}

export default DocumentItem;
