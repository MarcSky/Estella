import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ProgressBar from 'react-progress-bar-plus';

@connect(
  state => ({
    percent: state.progress.percent
  })
)
class GlobalProgressBar extends Component {
  static propTypes = {
    percent: PropTypes.number
  };

  render() {
    return (
      <ProgressBar percent={this.props.percent} autoIncrement intervalTime={(Math.random() * 1000)} />
    );
  }
}

export default GlobalProgressBar;
