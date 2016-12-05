import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as studentActions from 'redux/modules/student';
import Select from 'react-select';

function mapStateToProps(state) {
  const {
    student: { data },
    entities: { students }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, students[id]);
      obj.value = obj.id;
      return obj;
    });
  }

  return {
    students: list,
    error: state.student.error
  };
}

@connect(
  mapStateToProps,
  {...studentActions}
)
class SelectStudent extends Component {

  static propTypes = {
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    students: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
  };

  handleChange(newstudent) {
    this.props.onChange(newstudent.value);
  }

  renderValue(option) {
    return <strong>{option.sname} {option.fname.charAt(0)}.{option.pname.charAt(0)}.</strong>;
  }

  renderOption(option) {
    return <span>{option.sname} {option.fname.charAt(0)}.{option.pname.charAt(0)}.</span>;
  }

  render() {
    const { students, value, defaultValue, onBlur } = this.props;
    return (
      <Select
        allowCreate={false}
        placeholder="Выберите студента"
        noResultsText="Студентов нет"
        options={students}
        optionRenderer={::this.renderOption}
        valueRenderer={::this.renderValue}
        onChange={::this.handleChange}
        onBlur={() => onBlur(value)}
        value={value || defaultValue || null}/>
    );
  }
}

export default SelectStudent;
