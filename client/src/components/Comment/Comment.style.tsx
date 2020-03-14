import styled, { css } from 'styled-components';

const StyledComment = styled.div<{ isSelected?: boolean }>`
  padding: 20px;
  border-radius: 10px;
  word-break: break-word;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.offwhite};
    background-color: ${theme.colors.white};
    margin-top: ${theme.spacings.top}px;
    margin-bottom: ${theme.spacings.bottom}px;
  `}

  ${p =>
    p.isSelected &&
    css`
      border: 1px solid ${p => p.theme.colors.green};
    `}

  .comment__header, a {
    font-size: 14px;
  }

  .comment__header {
    margin-bottom: 20px;
  }

  .comment__actions {
    margin-left: auto;
  }

  .hover__button {
    cursor: pointer;
    color: ${p => p.theme.colors.gray};

    &:hover {
      color: ${p => p.theme.colors.primary};
    }
  }

  .add-smile-icon {
    color: ${p => p.theme.colors.gray};

    .fa-smile {
      margin-right: 0 !important;
    }
    .fa-plus {
      font-size: 10px;
    }
  }
`;

export default StyledComment;
