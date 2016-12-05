import React, {Component, PropTypes} from 'react';
const _ = require('utils/lodash');
import {connect} from 'react-redux';
import * as teacherActions from 'redux/modules/teacher';
import Select from 'react-select';

function mapStateToProps(state) {
  const {
    teacher: { data },
    entities: { teachers }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, teachers[id]);
      obj.value = obj.id;
      return obj;
    });
  }

  return {
    teachers: list,
    error: state.teacher.error
  };
}

@connect(
  mapStateToProps,
  {...teacherActions}
)
class SelectTeacher extends Component {

  static propTypes = {
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    teachers: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
  };

  handleChange(newteachers) {
    if (_.pluck(newteachers, 'id').length <= 3) {
      this.props.onChange(_.pluck(newteachers, 'id'));
    }
  }

  renderValue(option) {
    return <strong>{option.sname} {option.fname.charAt(0)}.{option.pname.charAt(0)}.</strong>;
  }

  renderOption(option) {
    return <span>{option.sname} {option.fname.charAt(0)}.{option.pname.charAt(0)}.</span>;
  }

  render() {
    const { teachers, value, defaultValue, onBlur } = this.props;
    console.log(value);
    return (
      <Select
        multi
        allowCreate={false}
        placeholder="Выберите преподавателей"
        noResultsText="Преподавателей нет"
        options={teachers}
        optionRenderer={::this.renderOption}
        valueRenderer={::this.renderValue}
        onChange={::this.handleChange}
        onBlur={() => onBlur(value)}
        value={value || defaultValue || []}/>
    );
  }
}

export default SelectTeacher;
