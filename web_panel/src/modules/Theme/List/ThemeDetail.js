import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import {connect} from 'react-redux';
import * as themeActions from 'redux/modules/theme';
import {fetch as fetchTheme} from 'redux/modules/theme';
import DocumentItem from './DocumentItem';

function mapStateToProps(state) {
  const {
    theme: { current },
    entities: { themes }
  } = state;
  const theme = Object.assign({}, themes[current]);

  return {
    theme: theme,
    user: state.auth.user
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchTheme(params.id))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...themeActions, pushState: routeActions.push}
)
export default class ThemeDetail extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  handleView = () => {
    const { theme } = this.props;
    this.props.pushState(`/result/${theme.id}`);
  };

  handleBack = () => {
    const { theme } = this.props;
    this.props.pushState(`/coursework/detail/${theme.coursework.id}`);
  };

  render() {
    const { theme, user } = this.props;
    const styles = require('modules/style.scss');
    return (
      <Content>
        <Helmet title={`Тема курсовой работы - ${theme.name}`}/>
        <div className="content-heading">
          <div className={`btn-group ${styles.fixButtonGroup}`}>
            <button type="button"
                    className="btn btn-green pull-right"
                    onClick={() => this.handleBack()}>
              <em className="fa fa-long-arrow-left mr-sm" />
              Назад
            </button>
          </div>
          <div className="pull-right">
            <div className="btn-group">
              <button type="button"
                      className="btn btn-primary pull-right"
                      onClick={() => this.handleView()}>
                <em className="fa fa-desktop fa-fw mr-sm" />
                Пояснительная записка
              </button>
            </div>
          </div>
          {
            user.role === 'ROLE_TEACHER' &&
            <div className="pull-right">
              <div className="btn-group">
                <button type="button"
                        className={`btn btn-primary pull-right ${styles.fixButtonGroup}`}
                        onClick={() => this.handleCreate()}>
                  <em className="fa fa-plus-circle fa-fw mr-sm" />
                  Добавить материал
                </button>
              </div>
            </div>
          }
          {theme.name}
       </div>
       <div className="panel panel-default">
         <fieldset className={`${styles.fixCourseworkName}`}>
           <div className="form-group mb">
             <label
               className="col-sm-4 control-label">
               Название курсового проекта
             </label>
             <div className="col-sm-8">
               <em>{theme.coursework.name}</em>
             </div>
           </div>
         </fieldset>
         <fieldset>
           <div className="form-group mb">
             <label
               className="col-sm-4 control-label">
               Тема курсового проекта
             </label>
             <div className="col-sm-8">
               <em>{theme.name}</em>
             </div>
           </div>
         </fieldset>
         <fieldset>
           <div className="form-group mb">
             <label
               className="col-sm-4 control-label">
               Преподаватели</label>
             <div className="col-sm-8">
              {
                theme.coursework && theme.coursework.teachers && theme.coursework.teachers.map((item) =>
                    <p key={item.id}>{item.sname} {item.fname} {item.pname}</p> )
              }
             </div>
           </div>
         </fieldset>
         <fieldset>
           <div className="form-group mb">
             <label
               className="col-sm-4 control-label">
               Студент
             </label>
             <div className="col-sm-8">
               { theme.student ? `${theme.student.sname} ${theme.student.fname} ${theme.student.pname} ` : 'Студент не указан'}
             </div>
           </div>
         </fieldset>
         <table className="table table-striped table-bordered table-hover">
           <thead>
             <tr>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Название материала</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Скачать</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Просмотр</th>
               {
                 user.role === 'ROLE_TEACHER' && <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Удалить</th>
               }
             </tr>
           </thead>
           <tbody>
           {
             theme.documents && theme.documents.map((item) =>
                <DocumentItem key={item.id} material={item} user={user}/>)
           }
           </tbody>
         </table>
       </div>
       </Content>
    );
  }
}
