/*eslint-disable */
import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Config from 'config';

class ReactCKEditor extends Component {

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onUpload: PropTypes.func
  };

  _editor = null;

  isControlled() {
    return 'value' in this.props && this.props.value !== undefined;
  }

  configurationEditor() {
    window.CKEDITOR.config.height = 500;
    window.CKEDITOR.config.language = 'ru';
    window.CKEDITOR.config.uiColor = '#FAFAFA';
    window.CKEDITOR.config.font_names =
      'Gotham Pro Regular/Gotham Pro Regular;' +
      'Gotham Pro Light/Gotham Pro Light;' +
      'Gotham Pro/Gotham Pro' +
      'Gotham Pro Medium/Gotham Pro Medium;' +
      'Swift/Swift;' +
      'Swift Light Regular/Swift Light Regular;' + window.CKEDITOR.config.font_names;
    window.CKEDITOR.config.font_defaultLabel = 'Swift';
    window.CKEDITOR.config.fontSize_defaultLabel = '18px';
  }

  hookEditor() {
    this._editor.on('change', () => {
      this.onEditorChange(this.getEditorContents())
    });
  }

  setEditorContents(value) {
    if (this._editor) this._editor.setData(value);
  }

  getEditorContents() {
    return this._editor.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this._editor) return;
    if ('value' in nextProps) {
      if (nextProps.value !== this.getEditorContents()) {
        this.setEditorContents(nextProps.value);
      }
    }
  }

  createUploader() {
    const onUpload = this.props.onUpload;
    return function(element, callback) {
      const file = element.$.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function handleLoad(img) {
          onUpload(img.currentTarget.result).then(
            (result) => {
              callback(Config.apiUrlClient + '/' + result.image);
            },
            () => {
              alert('Данная картинка не может быть загружена')
            }
          );
        };
        reader.readAsDataURL(file);
      } else {
        callback(null);
      }
    }
  }

  componentDidMount() {
    this.configurationEditor();
    this._editor = window.CKEDITOR.replace(ReactDOM.findDOMNode(this.refs.editor1), {
      uploadImage: this.createUploader()
    });
    this.hookEditor();

    this.setEditorContents(this.isControlled() ? this.props.value : '<p></p>');
  }

  componentWillUnmount() {
    if (this._editor) {
      this._editor.removeAllListeners();
      window.CKEDITOR.remove(this._editor);
      this._editor = null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  onEditorChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <textarea name="editor1" id="editor1" ref="editor1" defaultValue=""/>
    );
  }

}

export default ReactCKEditor;
