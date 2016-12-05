import React, {Component, PropTypes} from 'react';

export default class Content extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    unwrap: PropTypes.bool
  };

  defaultProps = {
    unwrap: false
  }

  render() {
    let childElement = this.props.children;

    if (this.props.unwrap) {
      childElement = <div className="unwrap">{this.props.children}</div>;
    }

    return (
      <div className="content-wrapper">
        {childElement}
      </div>
    );
  }
}
