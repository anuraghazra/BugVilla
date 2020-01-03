import React from 'react';
import styled from 'styled-components';
import Sidebar from 'components/Sidebar/Sidebar';

const DashboardWrapper = styled.section`
  padding: 40px;

  display: grid;
  grid-template-columns: 200px 1fr;
`
const DashboardBody = styled.section`
  margin-left: 30px;
`

const Dashboard: React.FC = () => {
  return (
    <DashboardWrapper>
      <Sidebar />
      <DashboardBody>
        <h1>Track Bugs</h1>
      </DashboardBody>
    </DashboardWrapper>
  )
}

export default Dashboard;