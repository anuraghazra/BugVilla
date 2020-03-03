import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Input, StyledH3Input } from 'components/common/Form';
import Button from 'components/common/Button';
import { toast } from 'components/common/Toast';

import AddBugSchema from './AddBugSchema';
import Editor from 'components/Editor/Editor';
import DashboardHeader from 'components/DashboardHeader';
import StyledEditor from 'components/Editor/Editor.style';
import AddBugWrapper from './AddBug.style';

import socket from 'utils/socket';
import { addBug } from 'store/ducks/bugs';
import { StoreState } from 'store';

const AddBug: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
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

  const [isLoading, error] = useSelector((state: StoreState) => [
    state.loading['bugs/ADD_BUG'],
    state.error['bugs/ADD_BUG']
  ]);
  const onSubmit = async (data: { title: string; body: string }) => {
    dispatch(addBug(data)).then(() => {
      reset();
      setValue('body', '');
      history.push('/dashboard/bugs');
      socket.emit('send-notification', { message: 'New bug' });
      toast.success('New bug added!');
    });
  };

  error && toast.error(error);
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
