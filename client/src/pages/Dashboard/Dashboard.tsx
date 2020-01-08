import React, { useState } from 'react';

import Bugs from 'pages/Bugs/Bugs';
import Navbar from 'components/Navbar/Navbar';
import Sidebar from 'components/Sidebar/Sidebar';

import { DashboardWrapper, DashboardBody } from './Dashboard.style';
import AuthRoute from 'components/AuthRoute';
import AddBug from 'components/AddBug/AddBug';
import NotFound from 'components/NotFound';
import { Route, Redirect } from 'react-router-dom';
import SingleBug from 'components/SingleBug/SingleBug';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardWrapper>
      <Navbar handleSidebar={handleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <DashboardBody>
        <AuthRoute exact path="/dashboard/bugs" component={Bugs} />
        <AuthRoute exact path="/dashboard/new-bug" component={AddBug} />
        <AuthRoute exact path="/dashboard/bugs/:bugId" component={SingleBug} />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
