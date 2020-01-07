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

  @media screen and (${p => p.theme.media.mobile}) {
    margin-top: ${p => p.theme.spacings.top}px;
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;

export const StyledH3Input = styled.div`
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 0px;

  label {
    flex-direction: row;
    background-color: initial;
    border: none;
  }

  input {
    width: 100%;
    font-family: ${p => p.theme.font.primaryBold};
    font-size: 24px;
    text-align: center;
    outline: none;
    border: none;
  }

  .text--error {
    margin-left: 30px;
    text-align: left;
  }
`;

export default LoginWrapper;
