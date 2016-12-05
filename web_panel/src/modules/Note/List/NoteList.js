import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import {connect} from 'react-redux';
import * as noteActions from 'redux/modules/note';
import {load as loadNote} from 'redux/modules/note';
import {fetch as fetchTheme} from 'redux/modules/theme';
import { asyncConnect } from 'redux-async-connect';
import { routeActions } from 'react-router-redux';
import NoteItem from './NoteItem';

function mapStateToProps(state) {
  const {
    note: { data, count, page },
    theme: { current },
    entities: { notes, themes }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, notes[id]);
      return obj;
    });
  }

  const theme = Object.assign({}, themes[current]);

  return {
    notes: list,
    theme: theme,
    user: state.auth.user,
    count: count,
    page: page
  };
}
@asyncConnect([{
  deferred: false,
  promise: ({store: {dispatch}, params}) => {
    return Promise.all([
      dispatch(loadNote(1, 100, params.idTheme)),
      dispatch(fetchTheme(params.idTheme))
    ]);
  }
}])
@connect(
  mapStateToProps,
  {...noteActions, pushState: routeActions.push}
)
export default class NoteList extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  handleAdd = () => {
    const { theme } = this.props;
    this.props.pushState(`/note/${theme.id}/add`);
  };

  handleBack = () => {
    const { theme } = this.props;
    this.props.pushState(`/result/${theme.id}`);
  };

  render() {
    const { notes, theme, user } = this.props;
    const styles = require('modules/style.scss');

    return (
      <Content>
        <Helmet title={theme.name}/>
        <div className="content-heading">
          <div className={`btn-group ${styles.fixButtonGroup}`}>
            <button type="button"
                    className="btn btn-green pull-right"
                    onClick={() => this.handleBack()}>
              <em className="fa fa-long-arrow-left mr-sm" />
              Назад
            </button>
          </div>
          { user.role === 'ROLE_TEACHER' &&
            <div className="pull-right">
              <div className="btn-group">
                <button type="button"
                        className="btn btn-green pull-right"
                        onClick={() => this.handleAdd()}>
                  <em className="fa fa-plus-circle fa-fw mr-sm" />
                  Добавить заметку
                </button>
              </div>
            </div>
          }
         {theme.name}
       </div>
       <div className="panel panel-default">
         <table className="table table-striped table-bordered table-hover">
           <thead>
             <tr>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Название</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Преподаватель</th>
               <th className={`h5 text-center hidden-xs hidden-sm ${styles.nameCol}`}>Дата создания</th>
                {
                  user.role === 'ROLE_TEACHER' && <th className={`h5 text-center hidden-xs hidden-sm ${styles.mcCol}`}>Редактировать</th>
                }
             </tr>
           </thead>
           <tbody>
           {
             notes && notes.map((item) =>
                <NoteItem key={item.id} user={user} note={item}/>)
           }
           </tbody>
         </table>
       </div>
       </Content>
    );
  }
}
