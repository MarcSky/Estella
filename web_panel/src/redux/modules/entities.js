const _ = require('utils/lodash');

const initialState = {
  subscribers: {}
};

function deepmerge(target, src) {
  const array = Array.isArray(src);
  let dst = array && [] || {};

  if (array) {
    dst = _.clone(src, true);
  } else {
    if (target && typeof target === 'object') { // копируем все поля с первого объекта
      Object.keys(target).forEach(key => {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(key => {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = deepmerge(target[key], src[key]);
        }
      }
    });
  }

  return dst;
}

export default function reducer(state = initialState, action = {}) {
  if (action.result && action.result.entities) {
    return deepmerge(_.assign({}, state), _.assign({}, action.result.entities));
  }
  return state;
}
