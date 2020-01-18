import React, { useState, useRef, useEffect } from 'react';

import Bugs from 'pages/Bugs/Bugs';
import Navbar from 'components/Navbar/Navbar';
import Sidebar from 'components/Sidebar/Sidebar';

import { DashboardWrapper, DashboardBody } from './Dashboard.style';
import AuthRoute from 'components/AuthRoute';
import AddBug from 'components/AddBug/AddBug';
import SingleBug from 'pages/SingleBug/SingleBug';
import Profile from 'pages/Profile/Profile';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    document.addEventListener('click', (e: any) => {
      if (e.target.closest('a')) {
        setIsSidebarOpen(false);
      }
    });
  }, []);

  return (
    <DashboardWrapper>
      <Navbar handleSidebar={handleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <DashboardBody>
        <AuthRoute exact path="/dashboard/bugs" component={Bugs} />
        <AuthRoute exact path="/dashboard/new-bug" component={AddBug} />
        <AuthRoute exact path="/dashboard/bugs/:bugId" component={SingleBug} />
        <AuthRoute exact path="/profiles/:username" component={Profile} />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
