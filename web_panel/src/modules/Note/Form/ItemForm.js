import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import validation from './validation';
import * as noteActions from 'redux/modules/note';
import { routeActions } from 'react-router-redux';
const _ = require('utils/lodash');

@connect(
  state => ({
    saveError: state.note.saveError
  }),
  {...noteActions, pushState: routeActions.push}
)
@reduxForm({
  form: 'note',
  fields: ['id', 'description', 'id_theme'],
  validate: validation
})

export default class ItemForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    destroyForm: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    values: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    flagSubmit: PropTypes.oneOf(['save', 'create']),
    pushState: PropTypes.func.isRequired,
    theme: PropTypes.object,
    note: PropTypes.object
  };

  state = {
    alertIsRemove: false,
  };

  componentWillUnmount() {
    this.props.destroyForm();
  }
  handleChange = (date) => {
    console.log(date);
  };

  customSubmit = () => {
    const { flagSubmit, save, create, values, theme } = this.props;

    const data = _.clone(values, true);
    if (flagSubmit === 'save') {
      save(data)
        .then(result => {
          this.props.pushState(`/note/${theme.id}`);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    } else if (flagSubmit === 'create') {
      create(data)
        .then(result => {
          this.props.pushState(`/note/${theme.id}`);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    }
  };

  render() {
    const { fields: { description }, theme, invalid,
      pristine, submitting, handleSubmit } = this.props;
    console.log(theme);
    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <div className="row">
            <div className="col-lg-2 col-lg-offset-1 pull-right">
              <div className="btn-group">
                <button className="btn btn-success"
                        onClick={handleSubmit(() => this.customSubmit())}
                        disabled={pristine || invalid || submitting}>
                  <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Сохранить
                </button>
              </div>
            </div>
            {theme.name}
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-body">
            <fieldset>
              <div className="form-group mb">
                <label
                  className="col-sm-2 control-label">Текст</label>
                <div className="col-sm-10">
                  <input type="text"
                             className="form-control"
                             {...description} />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
