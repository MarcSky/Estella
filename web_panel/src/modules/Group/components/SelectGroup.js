import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as groupActions from 'redux/modules/group';
import Select from 'react-select';

function mapStateToProps(state) {
  const {
    group: { data },
    entities: { groups }
  } = state;

  let list = [];
  if (data && Array.isArray(data)) {
    list = data.map(id => {
      const obj = Object.assign({}, groups[id]);
      obj.value = obj.id;
      return obj;
    });
  }

  return {
    groups: list,
    error: state.group.error
  };
}

@connect(
  mapStateToProps,
  {...groupActions}
)
class SelectGroup extends Component {

  static propTypes = {
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    groups: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
  };

  handleChange(newgroup) {
    console.log(newgroup);
    this.props.onChange(newgroup.value);
  }

  renderValue(option) {
    return <strong>{option.name}</strong>;
  }

  renderOption(option) {
    return <span>{option.name}</span>;
  }

  render() {
    const { groups, value, defaultValue, onBlur } = this.props;
    console.log(value);
    return (
      <Select
        allowCreate={false}
        placeholder="Выберите учебную группу"
        noResultsText="Учебных групп нет"
        options={groups}
        optionRenderer={::this.renderOption}
        valueRenderer={::this.renderValue}
        onChange={::this.handleChange}
        onBlur={() => onBlur(value)}
        value={value || defaultValue || null}/>
    );
  }
}

export default SelectGroup;
