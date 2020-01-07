import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { StyledH3Input } from 'components/Signup/Signup.style';
import Input from 'components/common/Form/Input';
import Button from 'components/common/Button';
import http from 'utils/httpInstance';

import AddBugSchema from './AddBugSchema';
import Editor from 'components/Editor/Editor';
import DashboardHeader from 'components/DashboardHeader';
import StyledEditor from 'components/Editor/Editor.style';
import AddBugWrapper from './AddBug.style';

const AddBug: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsloading] = useState();
  const { register, handleSubmit, errors }: any = useForm({
    validationSchema: AddBugSchema
  });

  const onSubmit = async (data: { title: string; body: string }) => {
    setIsloading(true);
    try {
      let res = await http({
        method: 'POST',
        url: '/api/bugs',
        data
      });
      console.log(res);
      setIsloading(false);
      history.push('/dashboard/bugs');
    } catch (err) {
      setIsloading(false);
    }
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
            errors={errors}
            inputRef={register({ required: 'Body is required' })}
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
