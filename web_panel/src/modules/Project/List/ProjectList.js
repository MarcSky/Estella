import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import {connect} from 'react-redux';
import * as themeActions from 'redux/modules/theme';
import {load as loadTheme} from 'redux/modules/theme';
import AbstractPagination from 'components/AbstractPagination';
import ProjectItem from './ProjectItem';

function mapStateToProps(state) {
  const {
    theme: { data, count, page },
    entities: { themes }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, themes[id]);
      return obj;
    });
  }

  return {
    themes: list,
    count: count,
    page: page,
    user: state.auth.user
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: { dispatch }, params}) => {
    return Promise.all([
      dispatch(loadTheme(Number(params.page) || 1, 20))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...themeActions, pushState: routeActions.push}
)
export default class ProjectList extends Component {
  static propTypes = {
    themes: PropTypes.array,
    load: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };
  render() {
    const { themes, count, page } = this.props;
    const styles = require('modules/style.scss');
    return (
      <Content>
        <Helmet title="Курсовые проекты"/>
        <div className="content-heading">
          Мои курсовые проекты
       </div>
        <div className="panel panel-default">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Курсовой проект</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Тема курсового проекта</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Число заметок</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Дата сдачи</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Преподаватели</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Пояснительная записка</th>
                <th className={`h5 text-center hidden-xs hidden-sm ${styles.paCol}`}>Информация</th>
              </tr>
            </thead>
            <tbody>
            {
              themes.map((item) => <ProjectItem key={item.id} theme={item} />)
            }
            </tbody>
          </table>
          <div className="panel-footer">
            <AbstractPagination activePage={Number(page)}
              path={{pathname: '/project/list'}}
              countItems={Number(count)}
              itemsPerPage={Number(20)}/>
          </div>
        </div>
      </Content>
    );
  }
}
