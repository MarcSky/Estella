import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import validation from './validation';
import * as courseworkActions from 'redux/modules/coursework';
import { routeActions } from 'react-router-redux';
const _ = require('utils/lodash');
import MyDayPicker from 'modules/MyDayPicker/MyDayPicker';
import SelectTeacher from './components/SelectTeacher';
import SelectGroup from 'modules/Group/components/SelectGroup';

@connect(
  state => ({
    saveError: state.coursework.saveError
  }),
  {...courseworkActions, pushState: routeActions.push}
)
@reduxForm({
  form: 'coursework',
  fields: ['id', 'name', 'end', 'teachers', 'group'],
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
    pushState: PropTypes.func.isRequired
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

  customSubmit = () => {
    const { flagSubmit, save, create, values } = this.props;

    const data = _.clone(values, true);
    if (flagSubmit === 'save') {
      save(data)
        .then(result => {
          this.props.pushState('/coursework');
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    } else if (flagSubmit === 'create') {
      create(data)
        .then(result => {
          this.props.pushState('/coursework');
          if (result && typeof result.error === 'object') {
            return Promise.reject(result.error);
          }
        });
    }
  };

  render() {
    const { fields: { name, end, teachers, group }, invalid,
      pristine, submitting, handleSubmit, flagSubmit } = this.props;
    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <div className="row">
            <div className="col-lg-9">
              {
                flagSubmit === 'create' ? 'Добавление курсового проекта' : 'Редактирование курсового проекта'
              }
            </div>
            <div className="col-lg-2 col-lg-offset-1">
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
                  className="col-sm-2 control-label">Дата сдачи</label>
                <div className="col-sm-10">
                  <MyDayPicker {...end} />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group mb">
                <label
                  className="col-sm-2 control-label">Преподаватели</label>
                <div className="col-sm-10">
                  <SelectTeacher {...teachers} />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group mb">
                <label
                  className="col-sm-2 control-label">Учебная группа</label>
                <div className="col-sm-10">
                  <SelectGroup {...group} />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
}
