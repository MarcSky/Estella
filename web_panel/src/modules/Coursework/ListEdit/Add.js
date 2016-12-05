import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as courseworkActions from 'redux/modules/coursework';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import {load as loadTeacher} from 'redux/modules/teacher';
import {load as loadGroup} from 'redux/modules/group';
import { asyncConnect } from 'redux-async-connect';


function mapStateToProps(state) {
  return {
    error: state.coursework.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      dispatch(loadTeacher(1, 100)),
      dispatch(loadGroup(1, 100))
    ]);
  }
}])

@connect(
  mapStateToProps,
  {...courseworkActions, initialize}
)
class Add extends Component {

  render() {
    return (
      <div>
        <Helmet title={'Добавление курсовой работы'} />
        <ItemForm initialValues={{}} flagSubmit="create" />
      </div>
    );
  }

}

export default Add;
