import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import validation from './validation';
import * as themeActions from 'redux/modules/theme';
import { routeActions } from 'react-router-redux';
const _ = require('utils/lodash');
import SelectStudent from './components/SelectStudent';

@connect(
  state => ({
    saveError: state.theme.saveError
  }),
  {...themeActions, pushState: routeActions.push}
)
@reduxForm({
  form: 'theme',
  fields: ['id', 'name', 'id_coursework', 'student'],
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
    coursework: PropTypes.object
  };

  state = {
    alertIsRemove: false,
  };

  componentWillUnmount() {
    this.props.destroyForm();
  }
  handleChange =(date)=>{
    console.log(date);
  };

  handleBack = () =>{
    const { coursework } = this.props;
    this.props.pushState(`/coursework/detail/${coursework.id}`);
  };

  customSubmit = () => {
    const { flagSubmit, save, create, values, coursework } = this.props;
    console.log(coursework);
    const data = _.clone(values, true);
    if (flagSubmit === 'save') {
      save(data)
        .then(result => {
          this.props.pushState(`/coursework/detail/${coursework.id}`);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    } else if (flagSubmit === 'create') {
      create(data)
        .then(result => {
          this.props.pushState(`/coursework/detail/${coursework.id}`);
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    }
  };

  render() {
    const { fields: { name, student }, coursework, invalid,
      pristine, submitting, handleSubmit, flagSubmit } = this.props;
    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <div className="row">
            <div className="col-md-1 btn-group">
              <button type="button"
                      className="btn btn-green pull-right"
                      onClick={() => this.handleBack()}>
                <em className="fa fa-long-arrow-left mr-sm" />
                Назад
              </button>
            </div>
            <div className="col-md-8">
              {
                flagSubmit === 'create' ? 'Добавление темы курсового проекта' : 'Редактирование темы курсового проекта'
              }
            </div>
            <div className="col-md-2 col-lg-offset-1">
              <div className="btn-group">
                <button className="btn btn-success"
                        onClick={handleSubmit(() => this.customSubmit())}
                        disabled={pristine || invalid || submitting}>
                  <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            {coursework.name || 'Нет названия'}
          </div>
          <div className="panel-body">
            <fieldset>
              <div className="form-group mb">
                <label
                  className="col-sm-2 control-label">Название</label>
                <div className="col-sm-10">
                  <input type="text"
                             className="form-control"
                             {...name} />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group mb">
                <label
                  className="col-sm-2 control-label">Студент</label>
                <div className="col-sm-10">
                  <SelectStudent {...student} />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
