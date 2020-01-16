import styled, { css } from 'styled-components';

const StyledDropdown = styled.div<{ isOpen?: boolean }>`
  width: fit-content;
  padding: 15px;
  border-radius: 5px;

  background-color: ${p => p.theme.colors.common.white};
  border: ${p => p.theme.border};

  opacity: 0;
  pointer-events: none;
  transform: translateY(-25px);
  transition: 0.2s;

  ${p =>
    p.isOpen &&
    css`
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    `}

  .dropdown__items {
    .dropdown__item {
      display: block;
      width: 150px;
      margin: 10px 0;
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid transparent;
      &:hover {
        background-color: ${p => p.theme.colors.common.offwhite};
      }
    }
    .label__selected {
      background-color: ${p => p.theme.colors.common.offwhite};
      border: 1px solid ${p => p.theme.colors.brand.secondary};
    }
  }

  .dropdown__checkbox {
    display: none;
  }
`;

export default StyledDropdown;