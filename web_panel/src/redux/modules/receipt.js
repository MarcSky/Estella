const _ = require('utils/lodash');

const LOAD = 'app/receipt/LOAD';
const LOAD_SUCCESS = 'app/receipt/LOAD_SUCCESS';
const LOAD_FAIL = 'app/receipt/LOAD_FAIL';

const initialState = {
  loaded: false,
  list: [],
  current: ''
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
        current: String(action.result.month)
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        list: [],
        error: action.error
      };
    default:
      return state;
  }
}

export function load(idClient, month = null) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        const params = {};
        if (month) {
          params['filter[month]'] = month;
        }
        params['filter[id_client]'] = idClient;
        client.get('/receipt', {params: params}, true).then(
          (result) => {
            if (_.isEmpty(result)) {
              resolve({list: []});
              return;
            }
            resolve({list: result.items, month: result.items[0].date_receipt});
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
