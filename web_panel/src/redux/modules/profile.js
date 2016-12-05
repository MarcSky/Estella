const UPDATE = 'app/profile/UPDATE';
const UPDATE_SUCCESS = 'app/profile/UPDATE_SUCCESS';
const UPDATE_FAIL = 'app/profile/UPDATE_FAIL';

const initialState = {
  loaded: false,
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        loading: true
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true
      };
    case UPDATE_FAIL:
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

export function update(data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client.put('/profile', {
          data: data
        }, true).then(
          (result) => {
            resolve(result);
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
