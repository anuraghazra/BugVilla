import { useEffect, useState } from 'react';
import StyledDropdown from 'components/LabelEditDropdown/Dropdown.style';
import React from 'react';

interface BaseDropdownProps {
  isOpen?: boolean;
  children: any;
  trigger?: any;
  [x: string]: any;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  isOpen,
  children,
  trigger,
  ...props
}) => {
  const [isDropdownOpen, setDropdownState] = useState(false);

  const closeDropdown = (e: any) => {
    if (e.target.closest('.label__header')) return;
    if (!e.target.closest('.label__dropdown')) {
      setDropdownState(false);
    }
  };
  const toggleDropdown = () => {
    setDropdownState(!isDropdownOpen);
  };

  useEffect(() => {
    return document.body.addEventListener('click', closeDropdown);
  }, []);

  // if type is object then its a ReactElement,
  // add OnClick handler to it automatically
  return (
    <>
      {trigger(toggleDropdown)}
      <StyledDropdown isOpen={isDropdownOpen} {...props}>
        {typeof children === 'object'
          ? React.cloneElement(children, { onClick: closeDropdown })
          : children(toggleDropdown)}
      </StyledDropdown>
    </>
  );
};

export default BaseDropdown;
