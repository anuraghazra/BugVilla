import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { DashboardWrapper, DashboardBody } from './Dashboard.style';

import AuthRoute from 'components/AuthRoute';
import AddBug from 'components/AddBug/AddBug';
import Navbar from 'components/Navbar/Navbar';
import NotFound from 'components/NotFound';
import Sidebar from 'components/Sidebar/Sidebar';

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
    </DashboardWrapper>
  );
};


// | FrontEnd | BackEnd |
// | :---: | :---: |
// <p align="center"><img src="./assets/reactjs_.png" alt="Logo" width="100" height="100"> <br />Reactjs</p><p align="center"><img src="./assets/redux_logo.png" alt="Logo" width="100" height="100"> <br />Redux</p><p align="center"><img src="./assets/ts_logo.png" alt="Logo" width="90" height="90"> <br />Typescript</p><p align="center"><img src="./assets/styledcompo_logo.png" alt="Logo" width="100" height="100"> <br />Styled Components</p><p align="center"><img src="./assets/cy_logo.png" alt="Logo" width="100" height="100"> <br />Cypress</p> |<p align="center"><img src="./assets/nodejs_logo.png" alt="Logo" width="85" height="90"> <br />Nodejs</p><p align="center"><img src="./assets/mongo_logo2.png" alt="Logo" width="90" height="100"> <br />MongoDB</p><p align="center"><img src="./assets/heroku_logo.png" alt="Logo" width="100" height="120"> <br />Heroku</p><p align="center"><img src="./assets/express_logo.png" alt="Logo" width="100" height="40"> <br />Express</p> 
export default Dashboard;
