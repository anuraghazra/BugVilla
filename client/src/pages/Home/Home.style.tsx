import styled from 'styled-components/macro';

const HomeWrapper = styled.section`
  position: relative;

  .home__left {
    width: 500px;
    min-height: 100vh;
    position: relative;
    top: 0;
    bottom: 0;

    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${p => p.theme.colors.brand.primary};
    color: ${p => p.theme.colors.common.white};

    .home__text {
      margin-left: -50px;
      z-index: 1;
    }

    @media screen and (${p => p.theme.media.mobile}) {
      min-height: 45vh;
      .home__text {
        margin-left: 0px;
      }
    }
  }

  .home__right {
    flex: 1;
  }

  .home__shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    z-index: 1;
  }
`;

export default HomeWrapper;
