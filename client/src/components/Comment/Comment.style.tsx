import styled, { css } from 'styled-components';

// prettier-ignore
const StyledComment = styled.div<{ isSelected?: boolean; isCommentEditorOpen?: boolean}>`
  padding: ${p => (p.isCommentEditorOpen ? 0 : 20)}px;
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
  .comment__dropdown--item {
    cursor: pointer;
    padding: 10px 15px;
    color: ${p => p.theme.colors.gray};

    &:hover {
      color: ${p => p.theme.colors.primary};
      background-color: ${p => p.theme.colors.offwhite};
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
