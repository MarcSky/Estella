import React, {Component, PropTypes} from 'react';

class ButtonSave extends Component {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const { onClick, submitting, disabled } = this.props;
    return (
      <button type="button"
              className="btn btn-labeled btn-success"
              onClick={onClick}
              disabled={disabled}>
         <span className="btn-label">
           <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}></i>
         </span> Сохранить
      </button>
    );
  }
}

export default ButtonSave;
