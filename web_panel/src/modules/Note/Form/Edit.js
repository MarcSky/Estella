import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import * as noteActions from 'redux/modules/note';
import Helmet from 'react-helmet';
import ItemForm from './ItemForm';
import {fetch as fetchNote} from 'redux/modules/note';
import {fetch as fetchTheme} from 'redux/modules/theme';
import { asyncConnect } from 'redux-async-connect';

function mapStateToProps(state) {
  const {
    note: { current },
    theme,
    entities: { notes, themes }
    } = state;
  const note = Object.assign({}, notes[current]);
  const themeObject = Object.assign({}, themes[theme.current]);
  return {
    note: note,
    theme: themeObject,
    error: state.theme.error
  };
}

@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(fetchTheme(params.idTheme)),
      dispatch(fetchNote(params.idNote))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...noteActions, initialize}
)
class Edit extends Component {

  static propTypes = {
    note: PropTypes.object.isRequired,
    theme: PropTypes.object
  };

  render() {
    const { note, theme } = this.props;
    return (
      <div>
        <Helmet title={theme.name} />
        <ItemForm theme={theme} note={note} initialValues={Object.assign({}, note, {id_theme: theme.id})} flagSubmit="save" />
      </div>
    );
  }

}

export default Edit;
