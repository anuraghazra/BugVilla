import styled from 'styled-components';

const SidebarWrapper = styled.aside<{ isOpen?: boolean }>`
  padding: 60px 40px;
  background-color: ${p => p.theme.colors.white};
  border-right: ${p => p.theme.border};

  .sidebar--sticky {
    position: sticky;
    top: 0;
  }
  p {
    margin: 0;
  }

  .dashboard__avatar {
    margin-bottom: 5px;
    margin-top: ${p => p.theme.spacings.top}px;
  }

  @media all and (${p => p.theme.media.tablet}) {
    position: fixed;
    left: ${p => (p.isOpen ? '0px' : '-200px')};
    top: 0;
    padding: 80px 25px;
    width: 200px;
    height: 100vh;
    z-index: 1;
    background-color: ${p => p.theme.colors.white};
    transition: 0.3s;

    a {
      font-size: 14px;
    }

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
