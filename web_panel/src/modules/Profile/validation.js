import memoize from 'lru-memoize';
import {createValidator, required, email, minLength} from 'utils/validation';

const passValidation = createValidator({
  email: [required, email],
  password: [required, minLength(7)],
  prev_password: [required, minLength(7)]
});

export default memoize(10)(passValidation);
