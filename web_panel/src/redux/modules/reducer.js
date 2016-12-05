import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import auth from './auth';
import {reducer as form} from 'redux-form';
import coursework from './coursework';
import entities from './entities';
import month from './month';
import receipt from './receipt';
import progress from './progress';
import theme from './theme';
import profile from './profile';
import statistic from './statistic';
import teacher from './teacher';
import group from './group';
import student from './student';
import note from './note';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  auth,
  progress,
  form,
  entities,
  coursework,
  month,
  receipt,
  theme,
  profile,
  statistic,
  teacher,
  group,
  student,
  note
});
