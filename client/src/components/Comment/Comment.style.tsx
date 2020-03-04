import styled, { css } from 'styled-components';

const StyledComment = styled.div<{ isSelected?: boolean }>`
  padding: 20px;
  border-radius: 10px;
  word-break: break-word;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.common.offwhite};
    background-color: ${theme.colors.common.white};
    margin-top: ${theme.spacings.top}px;
    margin-bottom: ${theme.spacings.bottom}px;
  `}

  ${p =>
    p.isSelected &&
    css`
      border: 1px solid ${p => p.theme.colors.common.green};
    `}

  .comment__header, a {
    font-size: 14px;
  }

  .comment__header {
    margin-bottom: 20px;
  }

  .comment__actions {
    margin-left: auto;

    > span:not(:last-child) {
      margin-right: 10px;
    }
  }

  .hover__button {
    cursor: pointer;
    color: ${p => p.theme.colors.text.gray};

    &:hover {
      color: ${p => p.theme.colors.brand.primary};
    }
  }

  .add-smile-icon {
    color: ${p => p.theme.colors.text.gray};

    .fa-smile {
      margin-right: 0 !important;
    }
    .fa-plus {
      font-size: 10px;
    }
  }
`;

export default StyledComment;
