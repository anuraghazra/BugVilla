import React from 'react';
import styled from 'styled-components';
import Sidebar from 'components/Sidebar/Sidebar';
import Bugs from 'pages/Bugs/Bugs';

const DashboardWrapper = styled.section`
  display: grid;
  grid-template-columns: 250px 1fr;

  @media screen and (${p => p.theme.media.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DashboardBody = styled.section`
  padding: 40px;

  @media screen and (${p => p.theme.media.tablet}) {
    padding: 25px;
  }
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardWrapper>
      <Sidebar />
      <DashboardBody>
        <h1>Track Bugs</h1>
        <Bugs />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
