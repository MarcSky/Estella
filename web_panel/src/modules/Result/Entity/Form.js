import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactCKEditor from 'components/Editor/index';
import {reduxForm} from 'redux-form';
import themeValidation from './themeValidation';
import * as themeActions from 'redux/modules/theme';
import ButtonSave from './ButtonSave';
import { routeActions } from 'react-router-redux';

@connect(
  state => ({
    saveError: state.theme.saveError,
  }),
  {...themeActions, pushState: routeActions.push}
)
@reduxForm({
  form: 'theme',
  fields: ['id', 'text'],
  validate: themeValidation
})
export default class Form extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    destroyForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    values: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  state = {
    editorState: null
  };

  componentWillUnmount() {
    this.props.destroyForm();
  }

  handleChangeEdit = (newText) => {
    const {fields: { text }} = this.props;
    text.onChange(newText);
  };

  handleComment = () => {
    const { theme } = this.props;
    this.props.pushState(`/note/${theme.id}`);
  };

  render() {
    const { theme, fields: { text },
      submitting, handleSubmit } = this.props;

    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <div className="row">
          <div className="col-lg-2">
              <div className="btn-group">
                <ButtonSave status={theme.status}
                            onClick={() => handleSubmit()}
                            disabled={submitting}
                            submitting={submitting} />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="btn-group">
                <button type="button"
                        className="btn btn-primary pull-right"
                        onClick={() => this.handleComment()}>
                  <em className="fa fa-desktop fa-fw mr-sm" />
                  Заметки
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
              <ReactCKEditor value={text.value || '<p></p>'}
                             onChange={this.handleChangeEdit}/>
          </div>
        </div>
      </div>
    );
  }
}
