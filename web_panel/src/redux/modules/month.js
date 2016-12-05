const _ = require('utils/lodash');

const LOAD = 'app/months/LOAD';
const LOAD_SUCCESS = 'app/months/LOAD_SUCCESS';
const LOAD_FAIL = 'app/months/LOAD_FAIL';

const initialState = {
  loaded: false,
  loading: false,
  list: [],
  isNext: false
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
        list: action.result.list,
        page: action.result.page
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function load(subscribeId, page = 1, itemsPerPage = 15) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.get(`/clients/${subscribeId}/months`, {params: { page, count: itemsPerPage }}, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({list: []});
              return;
            }
            resolve({list: result.items, page: page, count: Number(result.count)});
          },
          (error) => {
            if (error.details.error.code === 404) {
              resolve({list: []});
            } else {
              reject(error);
            }
          }
        );
      });
    }
  };
}
