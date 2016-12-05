import { arrayOf, normalize } from 'normalizr';
import {student as studentSchema} from './schemas';
const _ = require('utils/lodash');

const LOAD = 'app/student/LOAD';
const LOAD_SUCCESS = 'app/student/LOAD_SUCCESS';
const LOAD_FAIL = 'app/student/LOAD_FAIL';

const FETCH = 'app/student/FETCH';
const FETCH_SUCCESS = 'app/student/FETCH_SUCCESS';
const FETCH_FAIL = 'app/student/FETCH_FAIL';


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
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.student && globalState.student.loaded;
}

export function load(page, itemsPerPage, group) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        const params = {};
        if (group) {
          params['filter[id_group]'] = group;
        }
        client.get('/students', { params: Object.assign({ page, count: itemsPerPage }, params) }, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({result: [], items: 0, count: 0});
            }
            const items = result.items;
            const count = Number(result.count);
            const normalized = normalize(items, arrayOf(studentSchema));
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
        client.get(`/students/${id}`, {}, true).then(
          (result) => {
            const normalized = normalize(result, studentSchema);
            resolve(Object.assign({}, normalized));
          },
          (error) => {
            console.log(error);
            const normalized = normalize({id: 0, name: ''}, studentSchema);
            resolve(Object.assign({}, normalized));
          }
        );
      });
    }
  };
}
