import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import {connect} from 'react-redux';
import * as studentActions from 'redux/modules/student';
import {load as loadStudent} from 'redux/modules/student';
import AbstractPagination from 'components/AbstractPagination';
import Item from './Item';

function mapStateToProps(state) {
  const {
    student: { data, count, page },
    entities: { students }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, students[id]);
      return obj;
    });
  }

  return {
    students: list,
    count: count,
    page: page
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: { dispatch }, params}) => {
    return Promise.all([
      dispatch(loadStudent(Number(params.page) || 1, 20))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...studentActions, pushState: routeActions.push}
)
export default class StudentList extends Component {
  static propTypes = {
    students: PropTypes.array,
    load: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pushState: PropTypes.func.isRequired
  };

  handleCreate = () => {
    this.props.pushState('/student/add');
  };

  render() {
    const { students, count, page } = this.props;
    const styles = require('modules/style.scss');
    return (
      <Content>
        <Helmet title="Список учебных групп"/>
        <div className="content-heading">
         Список учебных групп
        </div>
        <div className="panel panel-default">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Фамилия</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Имя</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Отчество</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Учебная группа</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Кафедра</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Курсовой проект</th>
              </tr>
            </thead>
            <tbody>
            {
              students.map((item) => <Item key={item.id} student={item} />)
            }
            </tbody>
          </table>
          <div className="panel-footer">
            <AbstractPagination activePage={Number(page)}
              path={{pathname: '/student/list'}}
              countItems={Number(count)}
              itemsPerPage={Number(20)}/>
          </div>
        </div>
      </Content>
    );
  }
}
