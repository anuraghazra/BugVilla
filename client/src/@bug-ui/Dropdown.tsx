import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef
} from 'react';
import styled, { css } from 'styled-components/macro';

type TReactDispatch = ((event: any) => void) | undefined;
interface IDropdownContext {
  toggle: TReactDispatch;
  close: TReactDispatch;
  isDropdownOpen: boolean;
}
const DropdownContext = React.createContext<IDropdownContext>({
  toggle: undefined,
  close: undefined,
  isDropdownOpen: false
});

interface DropdownProps {
  onChange?: (toggle: boolean) => void;
  shouldCloseOnClick?: boolean;
  [x: string]: any;
}

type ToggleFuncProps = (
  /** Toggle Dropdown Menu */
  toggle: TReactDispatch,
  /** Close Dropdown Menu */
  close: TReactDispatch
) => {};
interface DropdownToggleProps {
  children: ToggleFuncProps | React.ReactNode;
  [x: string]: any;
}
interface DropdownContentProps {
  [x: string]: any;
}
type StaticComponents = {
  Toggle: React.FC<DropdownToggleProps>;
  Content: React.FC<DropdownContentProps>;
};

export const Dropdown: React.FC<DropdownProps> & StaticComponents = ({
  children,
  onChange,
  shouldCloseOnClick,
  ...props
}) => {
  const id = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdown] = useState(false);

  const toggle = () => setDropdown(!isDropdownOpen);
  const close = () => setDropdown(false);

  const closeDropdown = useCallback(
    e => {
      // check click inside dropdown content
      if (e.target.closest('.dropdown--content') && shouldCloseOnClick) {
        close();
        return;
      }
      // close all other dropdowns
      if (e.target.closest('.dropdown') !== id.current) {
        close();
        return;
      }
    },
    [shouldCloseOnClick]
  );

  useEffect(() => {
    onChange && onChange(isDropdownOpen);
  }, [isDropdownOpen, onChange]);

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [closeDropdown]);

  const value = React.useMemo(() => ({ isDropdownOpen, toggle, close }), [
    isDropdownOpen,
    toggle,
    close
  ]);

  return (
    <div {...props}>
      <DropdownContext.Provider value={value}>
        <div ref={id} className={`dropdown`} style={{ position: 'relative' }}>
          {children}
        </div>
      </DropdownContext.Provider>
    </div>
  );
};

const Toggle: React.FC<DropdownToggleProps> = ({ children }) => {
  const { toggle, close } = useContext(DropdownContext);

  return (
    <div data-testid="dropdown-toggle">
      {React.isValidElement(children)
        ? React.cloneElement(children, { onClick: toggle })
        : (children as ToggleFuncProps)(toggle, close)}
    </div>
  );
};
Dropdown.Toggle = React.memo(Toggle);

const Content: React.FC<DropdownContentProps> = ({ children, ...props }) => {
  const { isDropdownOpen } = useContext(DropdownContext);
  return (
    <StyledDropdownContent
      data-testid="dropdown-content"
      className="dropdown--content"
      isOpen={isDropdownOpen}
      {...props}
    >
      {children}
    </StyledDropdownContent>
  );
};
Dropdown.Content = React.memo(Content);

const StyledDropdownContent = styled.div<{ isOpen?: boolean }>`
  width: max-content;
  padding: 15px;
  border-radius: 5px;
  position: absolute;
  right: 0;
  margin-top: 5px;

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
`;
