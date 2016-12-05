const BEGIN_GLOBAL_LOAD = 'reduxAsyncConnect/BEGIN_GLOBAL_LOAD';
const END_GLOBAL_LOAD = 'reduxAsyncConnect/END_GLOBAL_LOAD';

const initialState = {
  percent: -1
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case BEGIN_GLOBAL_LOAD:
      return {
        ...state,
        percent: 50
      };
    case END_GLOBAL_LOAD:
      return {
        ...state,
        percent: 100
      };
    default:
      return state;
  }
}
