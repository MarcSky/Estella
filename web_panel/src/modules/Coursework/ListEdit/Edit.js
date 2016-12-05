import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as courseworkActions from 'redux/modules/coursework';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import {fetch as fetchCoursework} from 'redux/modules/coursework';
import { asyncConnect } from 'redux-async-connect';
import {load as loadTeacher} from 'redux/modules/teacher';
import {load as loadGroup} from 'redux/modules/group';

function mapStateToProps(state) {
  const {
    coursework: { current },
    entities: { courseworks }
    } = state;
  const coursework = Object.assign({}, courseworks[current]);

  return {
    coursework: coursework,
    error: state.coursework.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchCoursework(params.id)),
      dispatch(loadTeacher(1, 100)),
      dispatch(loadGroup(1, 100))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...courseworkActions, initialize}
)
class Edit extends Component {

  static propTypes = {
    coursework: PropTypes.object.isRequired
  };

  render() {
    const { coursework } = this.props;

    return (
      <div>
        <Helmet title={coursework.name} />
        <ItemForm initialValues={coursework} flagSubmit="save" />
      </div>
    );
  }

}

export default Edit;
