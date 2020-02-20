import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { StyledH3Input } from 'components/Signup/Signup.style';
import Input from 'components/common/Form/Input';
import Button from 'components/common/Button';

import AddBugSchema from './AddBugSchema';
import Editor from 'components/Editor/Editor';
import DashboardHeader from 'components/DashboardHeader';
import StyledEditor from 'components/Editor/Editor.style';
import AddBugWrapper from './AddBug.style';
import useAPI from 'hooks/useAPI';
import Toast from 'components/common/Toast';
import { notify } from 'react-notify-toast';

const AddBug: React.FC = () => {
  const history = useHistory();
  const { loading: isLoading, error, callAPI } = useAPI();
  const {
    register,
    handleSubmit,
    errors,
    watch,
    reset,
    setValue
  }: any = useForm({
    validationSchema: AddBugSchema
  });
  const markdown = watch('body');
  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  const onSubmit = async (data: { title: string; body: string }) => {
    callAPI({ method: 'POST', url: '/api/bugs', data }, () => {
      reset();
      setValue('body', '');
      history.push('/dashboard/bugs');
    }).catch(err => {
      notify.show(<Toast>{err}</Toast>, 'error');
    });
  };

  return (
    <AddBugWrapper>
      <DashboardHeader>
        <h1>Submit new bug</h1>
      </DashboardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledEditor>
          <StyledH3Input className="bug__edit-title">
            <Input
              autoComplete="off"
              name="title"
              type="text"
              icon="edit"
              placeholder="Enter Title"
              errors={errors}
              inputRef={register({ required: 'Title is required' })}
            />
          </StyledH3Input>
          <Editor
            handleMarkdown={handleMarkdown}
            markdown={markdown}
            errors={errors}
            inputRef={register}
          />

          <Button
            isLoading={isLoading}
            type="submit"
            className="bug__button"
            icon="plus"
          >
            Submit
          </Button>
        </StyledEditor>
      </form>
    </AddBugWrapper>
  );
};

export default AddBug;
