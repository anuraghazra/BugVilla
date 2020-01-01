import styled from 'styled-components/macro';

const LoginWrapper = styled.div`
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
    
    .signup__username--text {
      color: ${p => p.theme.colors.text.gray};
      margin: 5px 0;
      margin-bottom: 15px;
    }
    .signup__username {
      margin-top: 15px;
      margin-bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 230px;

      input {
        text-align: center;
        width: 100%;
        outline: none;
        border: none;
        font-size: 24px;
        font-family: ${p => p.theme.font.primaryBold}
      }
    }
  }
`

export default LoginWrapper;