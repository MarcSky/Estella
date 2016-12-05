import memoize from 'lru-memoize';
import {createValidator, required, email, minLength} from 'utils/validation';

const loginValidation = createValidator({
  username: [required, email],
  password: [required, minLength(7)]
});

export default memoize(10)(loginValidation);
