import {createValidator, required} from 'utils/validation';

const themeValidation = createValidator({
  text: [required]
});

export default themeValidation;
