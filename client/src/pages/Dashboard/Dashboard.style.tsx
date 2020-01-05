import styled from 'styled-components';

export const DashboardWrapper = styled.section`
  display: grid;
  grid-template-columns: 250px 1fr;

  @media screen and (${p => p.theme.media.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardBody = styled.section`
  padding: 40px;

  @media screen and (${p => p.theme.media.tablet}) {
    padding: 80px 25px;
  }
`;
