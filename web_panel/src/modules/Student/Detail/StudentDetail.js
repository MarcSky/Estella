import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import {connect} from 'react-redux';
import * as themeActions from 'redux/modules/theme';
import {load as loadTheme} from 'redux/modules/theme';
import {fetch as fetchStudent} from 'redux/modules/student';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import StudentItem from './StudentItem';

function mapStateToProps(state) {
  const {
    theme: { data, count, page },
    student: { current },
    entities: { themes, students }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, themes[id]);
      return obj;
    });
  }

  const student = Object.assign({}, students[current]);

  return {
    themes: list,
    student: student,
    count: count,
    page: page
  };
}
@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(loadTheme(1, 100, params.idStudent)),
      dispatch(fetchStudent(params.idStudent))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...themeActions, pushState: routeActions.push}
)
export default class StudentDetail extends Component {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    student: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  render() {
    const { themes, student } = this.props;
    console.log(student);
    const styles = require('modules/style.scss');

    return (
      <Content>
        <Helmet title="Список задействованных курсовых работ"/>
        <div className="content-heading">
         {student.sname} {student.fname}
       </div>
       <div className="panel panel-default">
         <table className="table table-striped table-bordered table-hover">
           <thead>
             <tr>
               <th className={`h5 ${styles.nameCol}`}>Название</th>
               <th className={`h5 ${styles.nameCol}`}>Число заметок</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Просмотр</th>
             </tr>
           </thead>
           <tbody>
           {
             themes && themes.map((item) =>
                <StudentItem key={item.id} theme={item}/>)
           }
           </tbody>
         </table>
       </div>
       </Content>
    );
  }
}
