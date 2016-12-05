import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as themeActions from 'redux/modules/theme';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import {fetch as fetchTheme} from 'redux/modules/theme';
import {fetch as fetchCoursework} from 'redux/modules/coursework';
import { asyncConnect } from 'redux-async-connect';
import {load as loadStudent} from 'redux/modules/student';

function mapStateToProps(state) {
  const {
    theme: { current },
    coursework,
    entities: { themes, courseworks }
    } = state;
  const theme = Object.assign({}, themes[current]);
  const courseworkObject = Object.assign({}, courseworks[coursework.current]);
  return {
    theme: theme,
    coursework: courseworkObject,
    error: state.theme.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return new Promise((resolve) => {
      Promise.all([
        dispatch(fetchTheme(params.id)),
        dispatch(fetchCoursework(params.idCoursework))
      ]).then(result => {
        const idTheme = result[0].result;
        const group = result[0].entities.themes[idTheme].coursework.group;
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
class Edit extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    coursework: PropTypes.object
  };

  render() {
    const { theme, coursework } = this.props;
    return (
      <div>
        <Helmet title={theme.name} />
        <ItemForm coursework={coursework} initialValues={Object.assign({}, theme, {id_coursework: coursework.id})} flagSubmit="save" />
      </div>
    );
  }

}

export default Edit;
