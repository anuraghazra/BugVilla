import styled from 'styled-components/macro';

const HomeWrapper = styled.section`
  position: relative;

  .home__left {
    width: 500px;
    height: 100vh;

    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
    
    background-color: ${p => p.theme.colors.brand.primary};
    color: ${p => p.theme.colors.common.white};
    
    .home__text {
      margin-left: -50px;
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
  }
`

export default HomeWrapper;