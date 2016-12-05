import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import {connect} from 'react-redux';
import * as themeActions from 'redux/modules/theme';
import {fetch as fetchTheme} from 'redux/modules/theme';
import Form from './Form';
const _ = require('utils/lodash');

function mapStateToProps(state) {
  const {
    theme: { current },
    entities: { themes }
  } = state;
  const theme = Object.assign({}, themes[current]);

  return {
    theme: theme,
    user: state.auth.user
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchTheme(params.id))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...themeActions, initialize, pushState: routeActions.push}
)
export default class ResultStudent extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  handleSubmit(data) {
    const { save } = this.props;
    const resultData = _.clone(data, true);
    return save(resultData).then(result => {
      if (result && typeof result.error === 'object') {
        return Promise.reject(result.error);
      }
    });
  }

  render() {
    const { theme } = this.props;
    return (
      <div>
        <Helmet title={theme.name}/>
        <Form initialValues={theme} onSubmit={this.handleSubmit.bind(this)} theme={theme}/>
      </div>
    );
  }
}
