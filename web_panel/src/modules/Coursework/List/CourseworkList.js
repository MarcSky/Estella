import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import {connect} from 'react-redux';
import * as courseworkActions from 'redux/modules/coursework';
import {load as loadCoursework} from 'redux/modules/coursework';
import AbstractPagination from 'components/AbstractPagination';
import CourseworkListItem from './CourseworkListItem';

function mapStateToProps(state) {
  const {
    coursework: { data, count, page },
    entities: { courseworks, teachers }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, courseworks[id]);
      obj.teachers = (obj.teachers) ? obj.teachers.map(idTeacher => teachers[idTeacher]) : [];
      return obj;
    });
  }

  return {
    courseworks: list,
    count: count,
    page: page
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: { dispatch }, params}) => {
    return Promise.all([
      dispatch(loadCoursework(Number(params.page) || 1, 20))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...courseworkActions, pushState: routeActions.push}
)
export default class CourseworkList extends Component {
  static propTypes = {
    courseworks: PropTypes.array,
    load: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleCreate = () => {
    this.props.pushState('/coursework/add');
  };

  render() {
    const { courseworks, count, page } = this.props;
    const styles = require('modules/style.scss');
    return (
      <Content>
        <Helmet title="Курсовые проекты"/>
        <div className="content-heading">
         <div className="pull-right">
           <div className="btn-group">
             <button type="button"
                     className="btn btn-green pull-right"
                     onClick={() => this.handleCreate()}>
               <em className="fa fa-plus-circle fa-fw mr-sm" />
               Добавить курсовой проект
             </button>
           </div>
         </div>
         Курсовые проекты
       </div>
        <div className="panel panel-default">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className={`h5 ${styles.nameCol}`}>Название</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Преподаватели</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Учебная группа</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Количество тем</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Дата сдачи</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Редактировать</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Удалить</th>
              </tr>
            </thead>
            <tbody>
            {
              courseworks.map((item) => <CourseworkListItem key={item.id} coursework={item} />)
            }
            </tbody>
          </table>
          <div className="panel-footer">
            <AbstractPagination activePage={Number(page)}
              path={{pathname: '/coursework/list'}}
              countItems={Number(count)}
              itemsPerPage={Number(20)}/>
          </div>
        </div>
      </Content>
    );
  }
}
