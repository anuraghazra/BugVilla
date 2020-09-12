import { css } from 'styled-components';

export default css`
  .text--bold {
    font-family: ${p => p.theme.font.primaryBold};
  }
  .text--light {
    font-family: ${p => p.theme.font.primaryLight};
  }
  .text--medium {
    font-family: ${p => p.theme.font.primaryMedium};
  }
  .color--error {
    color: ${p => p.theme.colors.red} !important;
  }
  .text--error {
    font-size: 14px;
    color: ${p => p.theme.colors.red};
  }
  .color--white {
    color: ${p => p.theme.colors.white};
  }
  .color--gray {
    color: ${p => p.theme.colors.gray};
  }
  .color--black {
    color: ${p => p.theme.colors.black};
  }
  .color--brand {
    color: ${p => p.theme.colors.primary};
  }

  .mt-small {
    margin-top: ${p => p.theme.space.small}px;
  }
  .mt-medium {
    margin-top: ${p => p.theme.space.medium}px;
  }
  .mr-medium {
    margin-right: ${p => p.theme.space.medium}px;
  }
  .ml-medium {
    margin-left: ${p => p.theme.space.medium}px;
  }
  .mb-medium {
    margin-left: ${p => p.theme.space.medium}px;
  }
  .ml-large {
    margin-left: ${p => p.theme.space.large}px;
  }
  .mr-large {
    margin-right: ${p => p.theme.space.large}px;
  }
  .mt-large {
    margin-top: ${p => p.theme.space.large}px;
  }
  .mb-large {
    margin-bottom: ${p => p.theme.space.large}px;
  }
`;
