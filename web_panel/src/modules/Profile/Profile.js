import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import { Row, Col } from 'react-bootstrap';
import {connect} from 'react-redux';
import PassForm from './PassForm';
import {load as loadAuth} from 'redux/modules/auth';
import {update as updateProfile} from 'redux/modules/profile';

@connect(
  (state) => {
    return {
      profile: state.auth.user
    };
  },
  {load: loadAuth, update: updateProfile}
)
export default class Home extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  };

  handleSubmit = (data) => {
    const { update, load } = this.props;

    return update(data)
      .then(result => {
        if (result && typeof result.error === 'object') {
          return Promise.reject(result.error);
        }
        return load().then(res => {
          if (res && typeof res.error === 'object') {
            return Promise.reject(res.error);
          }
        });
      });
  };

  render() {
    const {profile} = this.props;
    return (
      <Content>
        <Helmet title="Настройка"/>
        <Row>
          <Col md={6}>
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="text-center">
                  <h3 className="mt0">{profile.fname}</h3>
                  <p>{profile.sname}</p>
                </div>
                <hr/>
                <ul className="list-unstyled ph-xl">
                  <li>
                    <em className="fa fa-graduation-cap fa-fw mr-lg" />Администратор
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="panel panel-default">
              <div className="panel-heading">Изменить пароль</div>
              <div className="panel-body">
                <PassForm initialValues={{email: profile.email}} />
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    );
  }
}
