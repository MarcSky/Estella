import React from 'react';
import {IndexRedirect, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    NotFound,
  } from 'containers';

import Protected from 'components/Wrappers/Protected';
import Public from 'components/Wrappers/Public';
import Uploads from 'modules/Uploads/Uploads';
import Login from 'modules/Login/Login';

import CourseworkList from 'modules/Coursework/List/CourseworkList';
import CourseworkDetail from 'modules/Coursework/Detail/CourseworkDetail';
import CourseworkAdd from 'modules/Coursework/ListEdit/Add';
import CourseworkEdit from 'modules/Coursework/ListEdit/Edit';

import ThemeDetail from 'modules/Theme/List/ThemeDetail';
import ThemeAdd from 'modules/Coursework/DetailEdit/Add';
import ThemeEdit from 'modules/Coursework/DetailEdit/Edit';

import StudentList from 'modules/Student/List/StudentList';
import StudentDetail from 'modules/Student/Detail/StudentDetail';

import ResultStudent from 'modules/Result/Entity/ResultStudent';

import NoteList from 'modules/Note/List/NoteList';
import NoteAdd from 'modules/Note/Form/Add';
import NoteEdit from 'modules/Note/Form/Edit';

import ProjectList from 'modules/Project/List/ProjectList';

import Profile from 'modules/Profile/Profile';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        replace('/login');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth, checkAuth);
    } else {
      checkAuth();
    }
  };
  return (
    <Route path="/" component={App}>

      <Route component={Protected} onEnter={requireLogin}>
        <IndexRedirect to="coursework" />
        <Route path="coursework" component={CourseworkList}/>
        <Route path="coursework/list/:page" component={CourseworkList}/>
        <Route path="coursework/detail/list/:page" component={CourseworkDetail}/>
        <Route path="coursework/detail/:id" component={CourseworkDetail}/>
        <Route path="coursework/add" component={CourseworkAdd}/>
        <Route path="coursework/edit/:id" component={CourseworkEdit}/>

        <Route path="theme/detail/:id" component={ThemeDetail}/>
        <Route path="theme/:idCoursework/add" component={ThemeAdd}/>
        <Route path="theme/:idCoursework/edit/:id" component={ThemeEdit}/>

        <Route path="students" component={StudentList}/>
        <Route path="students/list/:page" component={StudentList}/>
        <Route path="students/detail/:idStudent" component={StudentDetail}/>

        <Route path="result/:id" component={ResultStudent}/>

        <Route path="note/:idTheme" component={NoteList}/>
        <Route path="note/:idTheme/add" component={NoteAdd}/>
        <Route path="note/:idTheme/edit/:idNote" component={NoteEdit}/>

        <Route path="project" component={ProjectList}/>

        <Route path="profile" component={Profile}/>
        <Route path="uploads" component={Uploads}/>
      </Route>

      <Route component={Public}>
        <Route path="login" component={Login} onEnter={Login.onEnter(store)}/>
          <Route path="*" component={NotFound} status={404} />
      </Route>

    </Route>
  );
};
