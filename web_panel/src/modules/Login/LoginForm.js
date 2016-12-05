import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import validation from './validation';
import {Alert} from 'react-bootstrap';

@reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate: validation
})
export default class LoginForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  render() {
    const { fields: { username, password },
      error, handleSubmit, submitting, pristine, invalid } = this.props;

    return (
      <form className="mb-lg">
        <div className="form-group has-feedback">
          <input {...username} type="email" placeholder="Логин" className="form-control" autoFocus />
          <span className="fa fa-envelope form-control-feedback text-muted" style={{'lineHeight': '35px'}} />
        </div>
        <div className="form-group has-feedback">
          <input {...password} type="password" placeholder="Пароль" className="form-control" />
          <span className="fa fa-lock form-control-feedback text-muted" style={{'lineHeight': '35px'}} />
        </div>
        <button type="submit"
                onClick={handleSubmit}
                className="btn btn-block btn-primary mt-lg"
                disabled={submitting || pristine || invalid}>
          <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Войти
        </button>
        <br />
        {error &&
        <Alert bsStyle="danger">
          <strong className="text-center">Неверный пароль или логин</strong>
        </Alert>
        }
      </form>
    );
  }
}
