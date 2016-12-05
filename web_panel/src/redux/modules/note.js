const _ = require('utils/lodash');
import { arrayOf, normalize } from 'normalizr';
import {note as noteSchema} from './schemas';

const LOAD = 'app/note/LOAD';
const LOAD_SUCCESS = 'app/note/LOAD_SUCCESS';
const LOAD_FAIL = 'app/note/LOAD_FAIL';

const FETCH = 'app/note/FETCH';
const FETCH_SUCCESS = 'app/note/FETCH_SUCCESS';
const FETCH_FAIL = 'app/note/FETCH_FAIL';

const SAVE = 'app/note/SAVE';
const SAVE_SUCCESS = 'app/note/SAVE_SUCCESS';
const SAVE_FAIL = 'app/note/SAVE_FAIL';

const CREATE = 'app/note/CREATE';
const CREATE_SUCCESS = 'app/note/CREATE_SUCCESS';
const CREATE_FAIL = 'app/note/CREATE_FAIL';

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
  return globalState.note && globalState.note.loaded;
}

export function load(page = 1, itemsPerPage = 15, theme) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        const params = {};
        if (theme) {
          params['filter[id_theme]'] = theme;
        }
        client.get('/notes', { params: Object.assign({ page, count: itemsPerPage }, params) }, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({result: [], items: 0, count: 0});
              return;
            }
            const items = result.items;
            const count = Number(result.count);
            const normalized = normalize(items, arrayOf(noteSchema));
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
        client.get(`/notes/${id}`, {}, true).then(
          (result) => {
            const normalized = normalize(result, noteSchema);
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

export function save(note) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: note.id,
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.put(`/notes/${note.id}`, {data: note}, true).then(
          (result) => {
            const normalized = normalize(result, noteSchema);
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

export function create(note) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.post('/notes', {data: note}, true).then(
          (result) => {
            const normalized = normalize(result, noteSchema);
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
