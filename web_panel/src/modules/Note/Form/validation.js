import {createValidator, required} from 'utils/validation';

const noteValidation = createValidator({
  description: [required]
});

export default noteValidation;
