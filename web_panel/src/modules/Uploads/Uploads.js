import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Content from 'components/Content';
import DropzoneComponent from 'react-dropzone-component';
import config from 'config.js';
import Cookies from 'js-cookie';

export default class Uploads extends Component {

  getCookies() {
    let access = '';
    let refresh = '';
    access = Cookies.get('access_token');
    refresh = Cookies.get('refresh_token');
    if (access === undefined || refresh === undefined) {
      return null;
    }
    return { access, refresh };
  }

  handlerInit = (params) => {
    console.log(params);
  };

  render() {
    require('./filepicker.css');

    const accessData = this.getCookies();

    const componentConfig = {
      iconFiletypes: ['.dbf'],
      showFiletypeIcon: true,
      postUrl: `${config.apiUrlClient}/api/v1/admin/upload`,
      autoProcessQueue: false
    };

    const djsConfig = {
      addRemoveLinks: true,
      headers: {
        'Authorization': 'Bearer ' + accessData.access
      },
      dictDefaultMessage: 'Перенесите файлы в данную облость'
    };

    return (
      <Content>
        <Helmet title="Загрузка"/>
        <h3>Загрузка
          <small>На этой странице вы можете зарузить квитанции</small>
        </h3>
        <DropzoneComponent config={componentConfig}
                           djsConfig={djsConfig}
                           eventHandlers={{init: this.handlerInit}} />
      </Content>
    );
  }
}
