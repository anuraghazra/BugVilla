import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { DashboardWrapper, DashboardBody } from './Dashboard.style';

import AuthRoute from 'components/AuthRoute';
import AddBug from 'components/AddBug/AddBug';
import Navbar from 'components/Navbar/Navbar';
import NotFound from 'components/NotFound';
import Sidebar from 'components/Sidebar/Sidebar';
import Footer from 'components/Footer';

import Bugs from 'pages/Bugs/Bugs';
import Profile from 'pages/Profile/Profile';
import Profiles from 'pages/Profiles/Profiles';
import SingleBug from 'pages/SingleBug/SingleBug';
import Notifications from 'pages/Notifications/Notifications';

// extracting out the logic to prevent re-render
const Navigation = React.memo(() => {
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
    <>
      <Navbar handleSidebar={handleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
    </>
  );
});

const Dashboard: React.FC = () => {
  return (
    <DashboardWrapper>
      <Navigation />
      <div>
        <DashboardBody>
          <Switch>
            <AuthRoute exact path="/dashboard/bugs" component={Bugs} />
            <AuthRoute exact path="/dashboard/new-bug" component={AddBug} />
            <AuthRoute
              exact
              path="/dashboard/bugs/:bugId"
              component={SingleBug}
            />
            <AuthRoute exact path="/profiles" component={Profiles} />
            <AuthRoute exact path="/profiles/:username" component={Profile} />
            <AuthRoute
              exact
              path="/dashboard/notifications"
              component={Notifications}
            />
            <Route path="/" component={NotFound} />
          </Switch>
        </DashboardBody>
        <Footer />
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
