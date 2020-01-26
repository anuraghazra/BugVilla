import React from 'react';
import styled, { css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StyledButtonProps {
  width?: string;
  success?: boolean;
  danger?: boolean;
  size?: 'sm' | 'md';
}

interface ButtonProps extends StyledButtonProps {
  icon?: any;
  isLoading?: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

export const ButtonGroup = styled.div`
  > button {
    margin-right: 10px;
  }
`;

// prettier-ignore
const StyledButton = styled.button<StyledButtonProps & React.HTMLAttributes<HTMLDivElement>>`
  background-color: ${p => p.theme.colors.brand.primary};
  color: ${p => p.theme.colors.common.white};
  ${p => p.success && css`
    background-color: ${p => p.theme.colors.common.greenlight};
    color: ${p => p.theme.colors.common.green};
  `}
  ${p => p.danger && css`
    background-color: ${p => p.theme.colors.common.redlight};
    color: ${p => p.theme.colors.common.red};
  `}

  
  width: ${p => p.width};
  height: fit-content;
  border: none;
  border-radius: 50px;
  padding: 10px 15px;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.2s;
  line-height: 1;
  font-size: 14px;

  ${p => p.size === 'sm' && css`
    padding: 10px 15px;
    font-size: 12px;
  `}
  ${p => p.size === 'md' && css`
    padding: 10px 15px;
    font-size: 12px;
  `}

  &:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }

  &:disabled {
    opacity: 0.8;
  }
`;

const Button: React.FC<ButtonProps> = ({
  size,
  width,
  icon,
  children,
  isLoading,
  ...props
}) => (
  <StyledButton {...props} size={size} disabled={isLoading} width={width}>
    {icon && (
      <FontAwesomeIcon
        data-testid="icon"
        spin={isLoading}
        icon={isLoading ? 'spinner' : icon}
      />
    )}
    {children}
  </StyledButton>
);

export default Button;
