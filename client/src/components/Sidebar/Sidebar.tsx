import React  from 'react';
import { useSelector } from 'react-redux';

import Avatar from 'components/Avatar/Avatar';
import BugVillaLogo from 'components/common/Logo';
import Flex from 'components/common/Flex';
import IconLink from 'components/common/IconLink';
import SidebarWrapper, { SidebarLinks } from './Sidebar.style';
import auth from 'utils/authHelper';
import { StoreState } from 'store';

interface SidebarProps {
  isOpen?: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const user = useSelector((state: StoreState) => state.auth.user);

  return (
    <SidebarWrapper isOpen={isOpen}>
      <BugVillaLogo width="100px" />
      <Flex align="center" justify="flex-start">
        <Avatar
          className="dashboard__avatar"
          width="130px"
          height="130px"
          size={130}
          username={user.username}
        />
        <div>
          <h2 className="text--bold">{user && user.name}</h2>
          <p className="color--gray">{user && user.username}</p>
        </div>
      </Flex>

      <SidebarLinks>
        <Flex direction="column">
          <IconLink isNav icon="home" to="/dashboard/bugs">
            Dashboard
          </IconLink>
          <IconLink isNav icon="user" to="/profiles">
            Profiles
          </IconLink>
          <IconLink isNav icon="times" to="/dashboard/bugs?status=closed">
            Closed
          </IconLink>
          <IconLink isNav icon="door-open" to="/login" onClick={auth.logout}>
            Logout
          </IconLink>
        </Flex>
      </SidebarLinks>
    </SidebarWrapper>
  );
};

export default Sidebar;
