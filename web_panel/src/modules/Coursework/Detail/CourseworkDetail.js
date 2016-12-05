import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import {connect} from 'react-redux';
import * as courseworkActions from 'redux/modules/coursework';
import {fetch as fetchCoursework} from 'redux/modules/coursework';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import AbstractPagination from 'components/AbstractPagination';
import CourseworkDetailItem from './CourseworkDetailItem';

function mapStateToProps(state) {
  const {
    coursework: { current, count, page },
    entities: { courseworks, teachers }
  } = state;
  const coursework = Object.assign({}, courseworks[current]);
  let list = [];
  if (coursework.teachers && Array.isArray(coursework.teachers)) {
    list = coursework.teachers.map(id => {
      const obj = Object.assign({}, teachers[id]);
      return obj;
    });
  }
  coursework.teachers = list;
  return {
    coursework: coursework,
    count: count,
    page: page,
    error: state.coursework.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchCoursework(params.id))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...courseworkActions, pushState: routeActions.push}
)
export default class CourseworkItem extends Component {
  static propTypes = {
    coursework: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleCreate = () => {
    const { coursework } = this.props;
    this.props.pushState(`theme/${coursework.id}/add`);
  };

  render() {
    const { coursework, count, page } = this.props;
    const styles = require('modules/style.scss');

    return (
      <Content>
        <Helmet title={`Курсовой проект - ${coursework.name}`}/>
        <div className="content-heading">
         <div className="pull-right">
           <div className="btn-group">
             <button type="button"
                     className="btn btn-green pull-right"
                     onClick={() => this.handleCreate()}>
               <em className="fa fa-plus-circle fa-fw mr-sm" />
               Добавить тему
             </button>
           </div>
         </div>
         {coursework.name}
       </div>
       <div className="panel panel-default">
         <table className="table table-striped table-bordered table-hover">
           <thead>
             <tr>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Тема курсового проекта</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Преподаватели</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Студент</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Учебная группа</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Дата сдачи</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Редактировать</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Удалить</th>
             </tr>
           </thead>
           <tbody>
           {
             coursework.themes && coursework.themes.map((item) =>
                <CourseworkDetailItem key={item.id} theme={item} teachers={coursework.teachers} end={coursework.end} group={coursework.group} coursework={coursework}/>)
           }
           </tbody>
         </table>
         <div className="panel-footer">
           <AbstractPagination activePage={Number(page)}
             path={{pathname: '/coursework/detail/list'}}
             countItems={Number(count)}
             itemsPerPage={Number(20)}/>
         </div>
       </div>
       </Content>
    );
  }
}
