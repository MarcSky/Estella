import React, {Component, PropTypes} from 'react';
const DatePicker = require('react-datepicker');
const moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');

class MyDayPicker extends Component {

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };
  handleDayClick = (date) => {
    console.log(date);
    this.props.onChange(String(moment(date).unix()));
  }
  render() {
    const {value} = this.props;
    let formatValue = moment().unix();
    if (value) {
      formatValue = Number(value);
    }

    return (<DatePicker selected={moment(formatValue, 'X')} onChange={this.handleDayClick} />);
  }
}

export default MyDayPicker;
