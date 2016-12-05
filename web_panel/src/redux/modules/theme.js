const _ = require('utils/lodash');
import { arrayOf, normalize } from 'normalizr';
import {theme as themeSchema} from './schemas';

const LOAD = 'app/theme/LOAD';
const LOAD_SUCCESS = 'app/theme/LOAD_SUCCESS';
const LOAD_FAIL = 'app/theme/LOAD_FAIL';

const FETCH = 'app/theme/FETCH';
const FETCH_SUCCESS = 'app/theme/FETCH_SUCCESS';
const FETCH_FAIL = 'app/theme/FETCH_FAIL';

const SAVE = 'app/theme/SAVE';
const SAVE_SUCCESS = 'app/theme/SAVE_SUCCESS';
const SAVE_FAIL = 'app/theme/SAVE_FAIL';

const CREATE = 'app/theme/CREATE';
const CREATE_SUCCESS = 'app/theme/CREATE_SUCCESS';
const CREATE_FAIL = 'app/theme/CREATE_FAIL';

const initialState = {
  loaded: false,
  loading: false,
  isNext: true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
        data: action.result.result,
        page: action.result.page,
        count: action.result.count,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case FETCH:
      return {
        ...state,
        loaded: false,
        loading: true
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        current: action.result.result,
        error: null
      };
    case FETCH_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        data: null,
        current: null,
        error: action.error
      };
    case SAVE:
      return state;
    case SAVE_SUCCESS:
      return {
        ...state,
        saveError: null
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
    case CREATE:
      return state;
    case CREATE_SUCCESS:
      const newData = (state.data) ? _.clone(state.data, true) : [];
      newData.unshift(action.result.result);
      return {
        ...state,
        data: newData
      };
    case CREATE_FAIL:
      return {
        ...state,
        createError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.theme && globalState.theme.loaded;
}

export function load(page = 1, itemsPerPage = 15, student) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        const params = {};
        if (student) {
          params['filter[id_student]'] = student;
        }
        client.get('/themes', { params: Object.assign({ page, count: itemsPerPage }, params) }, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({result: [], items: 0, count: 0});
              return;
            }
            const items = result.items;
            const count = Number(result.count);
            const normalized = normalize(items, arrayOf(themeSchema));
            resolve(Object.assign({}, normalized, { count, page }));
          },
          (error) => {
            if (error.status === '_TOKEN_INCORRECT') {
              reject(error);
              return;
            }
            resolve({result: [], items: 0, count: 0});
          }
        );
      });
    }
  };
}

export function fetch(id) {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.get(`/themes/${id}`, {}, true).then(
          (result) => {
            const normalized = normalize(result, themeSchema);
            resolve(Object.assign({}, normalized));
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

export function save(theme) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: theme.id,
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.put(`/themes/${theme.id}`, {data: theme}, true).then(
          (result) => {
            const normalized = normalize(result, themeSchema);
            resolve(Object.assign({}, normalized));
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

export function create(theme) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.post('/themes', {data: theme}, true).then(
          (result) => {
            const normalized = normalize(result, themeSchema);
            resolve(Object.assign({}, normalized));
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
