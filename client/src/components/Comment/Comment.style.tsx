import styled, { css } from 'styled-components';

const StyledComment = styled.div<{ isSelected?: boolean }>`
  padding: 20px;
  border: 1px solid ${p => p.theme.colors.common.offwhite};
  border-radius: 10px;
  margin-top: ${p => p.theme.spacings.top}px;
  margin-bottom: ${p => p.theme.spacings.bottom}px;
  position: relative;
  word-break: break-word;

  ${p =>
    p.isSelected &&
    css`
      border: 1px solid ${p => p.theme.colors.common.green};
    `}

  &:after {
    content: '';
    position: absolute;
    left: 15px;
    bottom: -${p => p.theme.spacings.bottom + 1}px;
    width: 2px;
    height: ${p => p.theme.spacings.bottom}px;
    background-color: ${p => p.theme.colors.common.offwhite};
  }
  .comment__header,
  a {
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

  .comment__reactions {
    margin-top: 20px;
    .reaction {
      padding: 5px 8px;
      border: 1px solid ${p => p.theme.colors.common.offwhite};
      border-left: none;
      cursor: pointer;
      z-index: 0;

      &:hover {
        background-color: ${p => p.theme.colors.brand.accent};
      }
      .reaction_emoji {
        font-size: 16px;
      }
      .reaction_count {
        margin-left: 5px;
        font-size: 14px;
      }
    }
    .reaction_selected {
      background-color: ${p => p.theme.colors.brand.accent};
    }
    .reaction:first-child {
      border: 1px solid ${p => p.theme.colors.common.offwhite};
      border-radius: 5px 0 0 5px;
    }
    .reaction:last-child {
      border-radius: 0 5px 5px 0;
    }
    .reaction:only-child {
      border-radius: 5px;
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
