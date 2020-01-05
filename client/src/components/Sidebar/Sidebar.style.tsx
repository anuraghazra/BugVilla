import styled from 'styled-components';

const SidebarWrapper = styled.aside`
  padding: 60px 40px;
  background-color: ${p => p.theme.colors.common.white};

  p {
    margin: 0;
  }

  .dashboard__avatar {
    margin-bottom: 5px;
    margin-top: ${p => p.theme.spacings.top}px;
  }

  @media all and (${p => p.theme.media.tablet}) {
    width: 200px;

    position: fixed;
    top: 0;
    left: 0;
    padding: 40px 25px;
    height: 100vh;
    z-index: 1;
    background-color: ${p => p.theme.colors.common.redlight};

    .dashboard__avatar {
      width: 100px;
      height: 100px;
      margin-top: ${p => p.theme.spacings.top}px;
    }
  }
`;

export const SidebarLinks = styled.div`
  margin-top: ${p => p.theme.spacings.top}px;

  a {
    margin: 15px 0;
  }
`;

export default SidebarWrapper;
