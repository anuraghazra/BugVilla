import * as yup from 'yup';

const AddBugSchema = yup.object().shape({
  title: yup.string().min(6).max(100).required(),
  body: yup.string().min(6).max(1000).required(),
});

export default AddBugSchema;
