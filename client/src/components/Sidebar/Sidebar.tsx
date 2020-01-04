import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';
import BugVillaLogo from 'components/common/Logo';
import Flex from 'components/common/Flex';
import IconLink from 'components/common/IconLink';

const SidebarWrapper = styled.aside`
  padding: 60px 40px;
  /* display: flex;
  flex-wrap: wrap; */

  p {
    margin: 0;
  }

  .dashboard__avatar {
    margin-bottom: 5px;
    margin-top: ${p => p.theme.spacings.top}px;
  }
`;

const SidebarLinks = styled.div`
  margin-top: ${p => p.theme.spacings.top}px;

  a {
    margin: 15px 0;
  }
`;

const Sidebar: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <SidebarWrapper>
      <BugVillaLogo width="100px" />
      <Flex align="center" justify="center">
        <Avatar
          className="dashboard__avatar"
          width="130px"
          height="130px"
          src={`/api/usedr/${user.username}/avatar/raw`}
        />
        <div>
          <h2 className="text--bold">{user && user.name}</h2>
          <p className="color--gray">{user && user.username}</p>
        </div>
      </Flex>

      <SidebarLinks>
        <Flex direction="column">
          <IconLink isNav icon="home" to="/dashboard">
            Dashboard
          </IconLink>
          <IconLink isNav icon="user" to="/profiles">
            Profiles
          </IconLink>
          <IconLink isNav icon="times" to="/closed">
            Closed
          </IconLink>
          <IconLink isNav icon="tag" to="/labels">
            Labels
          </IconLink>
        </Flex>
      </SidebarLinks>
    </SidebarWrapper>
  );
};

export default Sidebar;
