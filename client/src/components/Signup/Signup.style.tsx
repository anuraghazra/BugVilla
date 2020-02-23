import styled from 'styled-components/macro';

const LoginWrapper = styled.div`
  /* for centering Toast */
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;

  .logo {
    width: 100px;
    margin: 5px 0;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    margin-top: ${p => p.theme.spacings.my};
  }

  @media screen and (${p => p.theme.media.tablet}) {
    margin-top: ${p => p.theme.spacings.top}px;
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;


export default LoginWrapper;
