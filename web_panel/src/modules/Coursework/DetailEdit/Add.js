import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as themeActions from 'redux/modules/theme';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import { asyncConnect } from 'redux-async-connect';
import {fetch as fetchCoursework} from 'redux/modules/coursework';
import {load as loadStudent} from 'redux/modules/student';

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
    return new Promise((resolve) => {
      Promise.all([
        dispatch(fetchCoursework(params.idCoursework))
      ]).then(result => {
        const idCoursework = result[0].result;
        const group = result[0].entities.courseworks[idCoursework].group;
        dispatch(loadStudent(1, 100, group.id)).then(() => {
          resolve(result);
        });
        console.log(group);
        resolve(result);
      });
    });
  }
}])

@connect(
  mapStateToProps,
  {...themeActions, initialize}
)
class Add extends Component {

  static propTypes = {
    coursework: PropTypes.object.isRequired
  };

  render() {
    const { coursework } = this.props;
    return (
      <div>
        <Helmet title={'Добавление темы курсовой работы'} />
        <ItemForm coursework={coursework} initialValues={{id_coursework: coursework.id}} flagSubmit="create" />
      </div>
    );
  }

}

export default Add;
