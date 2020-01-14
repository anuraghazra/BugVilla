import styled from 'styled-components';

const StyledComment = styled.div`
  padding: 20px;
  border: 1px solid ${p => p.theme.colors.common.offwhite};
  border-radius: 10px;
  margin-top: ${p => p.theme.spacings.top}px;
  margin-bottom: ${p => p.theme.spacings.bottom}px;
  position: relative;
  word-break: break-word;

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

  .hover__button {
    cursor: pointer;
    position: relative;
    color: ${p => p.theme.colors.text.gray};

    &::after {
      content: 'Edit';
      width: 50px;
      position: absolute;
      left: -40px;
      pointer-events: none;
      text-align: center;
      font-size: 12px;
      opacity: 0;
      transition: 0.2s;
    }

    &:hover {
      &::after {
        opacity: 1;
        transition: 0.2s;
      }
      color: ${p => p.theme.colors.brand.primary};
    }
  }
`;

export default StyledComment;
