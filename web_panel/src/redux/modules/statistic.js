const LOAD = 'app/statistic/LOAD';
const LOAD_SUCCESS = 'app/statistic/LOAD_SUCCESS';
const LOAD_FAIL = 'app/statistic/LOAD_FAIL';

const initialState = {
  loading: false,
  data: {}
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
        data: action.result.data
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: {},
        error: action.error
      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.get('/statistic', {}, true).then(
          (result) => {
            resolve({data: result});
          },
          (error) => {
            if (error.details.error.code === 404) {
              resolve({data: {}});
            } else {
              reject(error);
            }
          }
        );
      });
    }
  };
}
