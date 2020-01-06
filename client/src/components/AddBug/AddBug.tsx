import React from 'react';
import styled from 'styled-components';
import DashboardHeader from 'components/DashboardHeader';

const Wrapper = styled.section`
`;

const AddBug: React.FC = () => {
  return (
    <Wrapper>
      <DashboardHeader>
        <h1>Add new bug</h1>
      </DashboardHeader>
      
      <p>Add new bug</p>
    </Wrapper>
  );
};

export default AddBug;
