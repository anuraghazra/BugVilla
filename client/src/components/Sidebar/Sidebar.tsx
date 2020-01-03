import React from "react";
import styled from "styled-components";
import Avatar from "components/Avatar/Avatar";

import dummyImage from "assets/images/avatar_dummy.png";
import { useSelector } from "react-redux";

const SidebarWrapper = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Sidebar: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <SidebarWrapper>
      <div>
        <Avatar width="120" height="120" src={dummyImage} />
        {user && <p>{user.name}</p>}
      </div>
    </SidebarWrapper>
  );
};

export default Sidebar;
