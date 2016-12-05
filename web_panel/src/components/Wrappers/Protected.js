import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import GlobalProgressBar from '../GlobalProgressBar';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

export default class Base extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    const animationName = 'rag-fadeIn';

    return (
        <div className="wrapper">
            <GlobalProgressBar />
            <Header />
            <Sidebar />
            <ReactCSSTransitionGroup
              component="section"
              transitionName={animationName}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
            {this.props.children}
            </ReactCSSTransitionGroup>
            <Footer />
        </div>
    );
  }

}
