import React, { useState } from 'react';

import Bugs from 'pages/Bugs/Bugs';
import Navbar from 'components/Navbar/Navbar';
import Sidebar from 'components/Sidebar/Sidebar';
import { DashboardWrapper, DashboardBody } from './Dashboard.style';

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
        <h1>Track Bugs</h1>
        <Bugs />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
