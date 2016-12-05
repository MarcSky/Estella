import {createValidator, required} from 'utils/validation';

const courseworkValidation = createValidator({
  name: [required]
});

export default courseworkValidation;
