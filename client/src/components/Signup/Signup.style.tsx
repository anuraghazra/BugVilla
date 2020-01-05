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
    width: 300px;
    margin-top: ${p => p.theme.spacings.my};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media screen and (${p => p.theme.media.mobile}) {
    margin-top: ${p => p.theme.spacings.top}px;
    margin-bottom: ${p => p.theme.spacings.bottom}px;
  }
`;

export const StyledH3Input = styled.div`
  width: 280px;
  margin-top: 10px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;

  label {
    flex-direction: row;
    background-color: initial;
    border: none;
  }

  input {
    text-align: center;
    width: 100%;
    outline: none;
    border: none;
    font-size: 24px;
    font-family: ${p => p.theme.font.primaryBold};
  }

  .text--error {
    text-align: left;
    margin-left: 30px !important;
  }
`;

export default LoginWrapper;
