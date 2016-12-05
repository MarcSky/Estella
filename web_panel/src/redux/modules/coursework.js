import { arrayOf, normalize } from 'normalizr';
import {coursework as courseworkSchema} from './schemas';
const _ = require('utils/lodash');

const LOAD = 'app/coursework/LOAD';
const LOAD_SUCCESS = 'app/coursework/LOAD_SUCCESS';
const LOAD_FAIL = 'app/coursework/LOAD_FAIL';

const FETCH = 'app/coursework/FETCH';
const FETCH_SUCCESS = 'app/coursework/FETCH_SUCCESS';
const FETCH_FAIL = 'app/coursework/FETCH_FAIL';

const SAVE = 'app/coursework/SAVE';
const SAVE_SUCCESS = 'app/coursework/SAVE_SUCCESS';
const SAVE_FAIL = 'app/coursework/SAVE_FAIL';

const CREATE = 'app/coursework/CREATE';
const CREATE_SUCCESS = 'app/coursework/CREATE_SUCCESS';
const CREATE_FAIL = 'app/coursework/CREATE_FAIL';


const initialState = {
  loaded: false,
  saveError: {},
  current: null
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
        data: null,
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
  return globalState.coursework && globalState.coursework.loaded;
}

export function load(page = 1, itemsPerPage = 20) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        const params = {};
        client.get('/coursework', { params: Object.assign({ page, count: itemsPerPage }, params) }, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({result: [], items: 0, count: 0});
            }
            const items = result.items;
            const count = Number(result.count);
            const normalized = normalize(items, arrayOf(courseworkSchema));
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
      return new Promise((resolve) => {
        client.get(`/coursework/${id}`, {}, true).then(
          (result) => {
            const normalized = normalize(result, courseworkSchema);
            resolve(Object.assign({}, normalized));
          },
          (error) => {
            console.log(error);
            const normalized = normalize({id: 0, name: ''}, courseworkSchema);
            resolve(Object.assign({}, normalized));
          }
        );
      });
    }
  };
}

export function save(coursework) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: coursework.id,
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.put(`/coursework/${coursework.id}`, {data: coursework}, true).then(
          (result) => {
            const normalized = normalize(result, courseworkSchema);
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

export function create(coursework) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.post('/coursework', {data: coursework}, true).then(
          (result) => {
            const normalized = normalize(result, courseworkSchema);
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
