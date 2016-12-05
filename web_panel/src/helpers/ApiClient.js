/*eslint-disable */

import superagent from 'superagent';
import Cookies from 'js-cookie';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  let adjustedPath = path[0] !== '/' ? '/' + path : path;
  adjustedPath = adjustedPath.substr(0, 6) !== '/oauth' ? '/api/v1' + adjustedPath : adjustedPath;

  let apiUrl = config.apiUrlClient;
  if (__SERVER__) {
    apiUrl = config.apiUrlServer;
  }
  return apiUrl + adjustedPath;
}

// TODO Reformating class ApiClient [Bug: two request witch update token]

class _ApiClient {
  constructor(req = null, res = null) {
    this.req = req;
    this.res = res;
    this.cookies = {};
    methods.forEach((method) => {
      this[method] = (path, options, isAuth = false) => {
        return new Promise((resolve, reject) => {
          const request = superagent[method](formatUrl(path));
          if (__SERVER__) {
            request.set('Accept', '*/*');
          }
          if (options && options.params) {
            request.query(options.params);
          }

          if (options && options.file) {
            request.attach(options.file.name, options.file);
          }

          if (isAuth) {
            const accessData = this.getCookies();
            if (accessData) {
              request.set('Authorization', 'Bearer ' + accessData.access_token);
            } else {
              this.removeCookies();
              reject({status: 'TOKEN_INCORRECT'});
              return;
            }
          }

          if (options && options.data) {
            request.send(options.data);
          }
          request.end((err, res) => {
            if (err) {
              if (res.body.error_description === 'The access token provided has expired.' ||
                  res.body.error_description === 'The access token provided is invalid.') {
                this.removeCookies();
                reject({status: 'TOKEN_INCORRECT'});
                return;
              }
              reject({status: 'COMMON_ERROR', details: res.body});
            } else {
              if (res.body) {
                resolve(res.body);
              }
              resolve({});
            }
          });
        });
      };
    });
  }

  removeCookies() {
    if (__SERVER__) {
      this.cookies = {};
      this.res.clearCookie('access_token');
      this.res.clearCookie('refresh_token');
    } else {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  }

  setCookies(data) {
    if (__SERVER__) {
      this.cookies.access_token = data.access_token;
      this.cookies.refresh_token = data.refresh_token;
      this.res.cookie('access_token', data.access_token);
      this.res.cookie('refresh_token', data.refresh_token);
    } else {
      Cookies.set('access_token', data.access_token);
      Cookies.set('refresh_token', data.refresh_token);
    }
  }

  getCookies() {
    let access_token = '';
    let refresh_token = '';
    if (__SERVER__) {
      if (this.cookies.access_token && this.cookies.refresh_token) {
        access_token = this.cookies.access_token;
        refresh_token = this.cookies.refresh_token;
      } else if (this.req.cookies.access_token && this.req.cookies.refresh_token) {
        access_token = this.req.cookies.access_token;
        refresh_token = this.req.cookies.refresh_token;
      } else {
        return null;
      }
    } else {
      access_token = Cookies.get('access_token');
      refresh_token = Cookies.get('refresh_token');
      if (access_token === undefined || refresh_token === undefined) {
        return null;
      }
    }
    return { access_token, refresh_token };
  }
}
const ApiClient = _ApiClient;

export default ApiClient;
