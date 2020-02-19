import styled from 'styled-components';

export const UserInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  @media screen and (${p => p.theme.media.desktop}) {
    grid-template-columns: 1fr;
  }

  .text--standout {
    
  }
`;

export const UserMetaInfo = styled.div`
  width: 500px;
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-gap: 40px;
  padding-right: 30px;
  border-right: 2px solid ${p => p.theme.colors.brand.accent};

  @media screen and (${p => p.theme.media.desktop}) {
    width: 80%;
    padding-right: 0px;
    grid-template-columns: 1fr;
    justify-items: left;
    border-right: none;
  }
  @media screen and (${p => p.theme.media.tablet}) {
    width: auto;
    justify-items: center;
  }
`;

