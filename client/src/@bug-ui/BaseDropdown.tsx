import { useEffect, useState } from 'react';
import StyledDropdown from 'components/LabelEditDropdown/Dropdown.style';
import React from 'react';

interface BaseDropdownProps {
  isOpen?: boolean;
  children: any;
  trigger?: (toggle: () => void) => any;
  shouldCloseOnClick?: boolean;
  [x: string]: any;
}

export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  isOpen,
  children,
  trigger,
  shouldCloseOnClick,
  ...props
}) => {
  const [isDropdownOpen, setDropdownState] = useState(false);

  const closeDropdown = (e: any) => {
    if (e.target.closest('.dropdown__content') && !shouldCloseOnClick) return;
    setDropdownState(false);
  };
  const toggleDropdown = () => {
    setDropdownState(!isDropdownOpen);
  };

  useEffect(() => {
    document.body.addEventListener('click', closeDropdown);
    return () => document.body.removeEventListener('click', closeDropdown);
  }, []);

  // if type is object then its a ReactElement,
  // add OnClick handler to it automatically
  return (
    <span role="menu" style={{ position: 'relative' }}>
      {trigger!(toggleDropdown)}
      <StyledDropdown
        data-testid="dropdown-content"
        isOpen={isDropdownOpen}
        {...props}
        className={props.className + ' dropdown__content'}
      >
        {typeof children === 'object'
          ? React.cloneElement(children, { onClick: closeDropdown })
          : children(toggleDropdown)}
      </StyledDropdown>
    </span>
  );
};

export default BaseDropdown;
