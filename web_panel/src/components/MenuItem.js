import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
const _ = require('utils/lodash');

class MenuItem extends Component {

  static propTypes = {
    to: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    children: PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object
  }

  static defaultProps = { img: 'fa-file-o' };

  render() {
    const { router: {isActive} } = this.context;
    const { to, img, children } = this.props;

    const classImg = _.startsWith(img, 'fa-') ? 'fa ' + img : img;

    const link = (
      <Link to={to} >
        <em className={classImg}></em>
        <span>
          {children}
        </span>
      </Link>
    );
    return <li className={isActive(to) ? 'active' : ''}>{link}</li>;
  }
}

export default MenuItem;
