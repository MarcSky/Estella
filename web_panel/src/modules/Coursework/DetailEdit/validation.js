import {createValidator, required} from 'utils/validation';

const themeValidation = createValidator({
  name: [required]
});

export default themeValidation;
