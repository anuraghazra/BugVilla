import styled, { css } from 'styled-components';

const StyledDropdown = styled.div<{ isOpen?: boolean }>`
  width: max-content;
  padding: 15px;
  border-radius: 5px;
  position: absolute;
  right: 0;

  background-color: ${p => p.theme.colors.white};
  border: ${p => p.theme.border};

  opacity: 0;
  pointer-events: none;
  transform: translateY(-25px);
  transition: 0.2s;
  z-index: 1;

  ${p =>
    p.isOpen &&
    css`
      opacity: 1;
      pointer-events: all;
      transform: translateY(5px);
    `}

  .dropdown__items {
    .dropdown__item {
      min-width: 150px;
      display: block;
      margin: 10px 0;
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid transparent;
      &:hover {
        background-color: ${p => p.theme.colors.offwhite};
      }
    }
    .label__selected {
      background-color: ${p => p.theme.colors.offwhite};
      border: 1px solid ${p => p.theme.colors.secondary};
    }
  }

  .dropdown__checkbox {
    display: none;
  }
`;

export default StyledDropdown;
