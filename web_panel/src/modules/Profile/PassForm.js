/*eslint-disable */
import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import validation from './validation';
import {load as loadAuth} from 'redux/modules/auth';
import {update as updateProfile} from 'redux/modules/profile';
import {connect} from 'react-redux';

@connect(
  null,
  {load: loadAuth, update: updateProfile}
)
@reduxForm({
  form: 'updatePass',
  fields: ['email', 'password', 'prev_password'],
  validate: validation
})
export default class PassForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string,
    load: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  };

  customSubmit = (data) => {
    const { update } = this.props;

    return update(data)
      .then(result => {
        if (result && typeof result.error === 'object') {
          return Promise.reject(result.error);
        }
        return Promise.resolve(result);
      });
  };

  render() {
    const { fields: { email, password, prev_password },
      handleSubmit, submitting, pristine, invalid } = this.props;

    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-lg-2 control-label">Email</label>
          <div className="col-lg-10">
            <input {...email} type="email" disabled className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <label className="col-lg-2 control-label">Текущий пароль</label>
          <div className="col-lg-10">
            <input {...prev_password} type="password" placeholder="Текущий пароль" className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <label className="col-lg-2 control-label">Новый пароль</label>
          <div className="col-lg-10">
            <input {...password} type="password" placeholder="Новый пароль" className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button className="btn btn-block btn-primary mt-lg"
                    onClick={handleSubmit(this.customSubmit)}
                    disabled={submitting || pristine || invalid}>
              <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Обновить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
