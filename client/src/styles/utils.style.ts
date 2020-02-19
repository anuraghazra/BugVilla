import { css } from 'styled-components';

export default css`
  .text--bold {
    font-family: ${p => p.theme.font.primaryBold}
  }
  .text--light {
    font-family: ${p => p.theme.font.primaryLight}
  }
  .text--medium {
    font-family: ${p => p.theme.font.primaryMedium}
  }
  .color--error {
    color: ${p => p.theme.colors.common.red} !important;
  }
  .text--error {
    font-size: 14px;
    color: ${p => p.theme.colors.common.red};
  }
  .color--white {
    color: ${p => p.theme.colors.common.white}
  }
  .color--gray {
    color: ${p => p.theme.colors.text.gray}
  }
  .color--black {
    color: ${p => p.theme.colors.text.black}
  }
  .color--brand {
    color: ${p => p.theme.colors.brand.primary}
  }
  .mt-5 {
    margin-top: 10px;
  }
  .ml-15 {
    margin-left: 15px;
  }
  .mr-10 {
    margin-right: 10px;
  }
`