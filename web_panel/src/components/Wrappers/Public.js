import React, {PropTypes, Component} from 'react';

export default class BasePage extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="wrapper">
        {this.props.children}
      </div>
    );
  }
}
