import Cookies from 'js-cookie';
import config from 'config';

const LOAD = 'app/auth/LOAD';
const LOAD_SUCCESS = 'app/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'app/auth/LOAD_FAIL';
const LOGIN = 'app/auth/LOGIN';
const LOGIN_SUCCESS = 'app/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'app/auth/LOGIN_FAIL';
const LOGOUT = 'app/auth/LOGOUT';
const LOGOUT_SUCCESS = 'app/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'app/auth/LOGOUT_FAIL';

const TOKEN_INCORRECT = 'app/auth/TOKEN_INCORRECT';

const initialState = {
  loaded: false,
  loading: false,
  user: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOKEN_INCORRECT:
      return {
        ...state,
        loggingOut: false,
        loaded: false,
        loading: false,
        user: null
      };
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && (globalState.auth.loaded || globalState.auth.loading);
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.get('/bootstrap', {}, true).then(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
  };
}

export function login(username, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.post('/oauth/v2/token', {
          data: {
            'client_id': config.auth.client_id,
            'client_secret': config.auth.client_secret,
            'grant_type': 'password',
            'username': username,
            'password': password
          }
        }, false).then(
          (result) => {
            Cookies.set('access_token', result.access_token);
            Cookies.set('refresh_token', result.refresh_token);
            resolve({login: true});
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    }
  };
}

export function logout() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: () => {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  };
}
