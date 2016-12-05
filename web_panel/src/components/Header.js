import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {logout} from 'redux/modules/auth';


@connect(
  null,
  {logout}
)
export default class Header extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <header className="topnavbar-wrapper">
          <nav role="navigation" className="navbar topnavbar">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand">
                <div className="brand-logo">
                  <h4 style={{marginTop: '5px', color: '#FFFFFF'}}>Личный кабинет</h4>
                </div>
              </Link>
            </div>
            <div className="nav-wrapper">
              <ul className="nav navbar-nav navbar-right">
                <li onClick={this.handleLogout} style={{cursor: 'pointer'}}>
                  <a>
                    <em className="icon-logout" /> Выход
                  </a>
                </li>
              </ul>
            </div>
          </nav>
      </header>
    );
  }

}
