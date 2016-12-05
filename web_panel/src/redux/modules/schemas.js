import { Schema, arrayOf } from 'normalizr';

export const coursework = new Schema('courseworks', { idAttribute: 'id' });
export const theme = new Schema('themes', { idAttribute: 'id' });
export const teacher = new Schema('teachers', { idAttribute: 'id' });
export const group = new Schema('groups', { idAttribute: 'id' });
export const student = new Schema('students', { idAttribute: 'id' });
export const note = new Schema('notes', { idAttribute: 'id' });

coursework.define({
  teachers: arrayOf(teacher)
});
