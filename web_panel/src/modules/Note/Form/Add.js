import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as noteActions from 'redux/modules/note';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import { asyncConnect } from 'redux-async-connect';
import {fetch as fetchTheme} from 'redux/modules/theme';

function mapStateToProps(state) {
  const {
    theme: { current },
    entities: { themes }
    } = state;
  const theme = Object.assign({}, themes[current]);

  return {
    theme: theme,
    error: state.theme.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchTheme(params.idTheme))
    ]);
  }
}])

@connect(
  mapStateToProps,
  {...noteActions, initialize}
)
class Add extends Component {

  static propTypes = {
    theme: PropTypes.object.isRequired
  };

  render() {
    const { theme } = this.props;
    return (
      <div>
        <Helmet title={'Добавление комментария'} />
        <ItemForm theme={theme} initialValues={{id_theme: theme.id}} flagSubmit="create" />
      </div>
    );
  }

}

export default Add;
