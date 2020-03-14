import React from 'react';
import styled, { css } from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium';
  width?: string;
}

interface ButtonProps extends StyledButtonProps {
  icon?: any;
  isLoading?: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

const button_sizes: any = {
  small: css`
    padding: 8px 10px;
    font-size: 12px;
  `,
  medium: css`
    padding: 10px 15px;
    font-size: 12px;
  `
};

type IStyledButton = StyledButtonProps & React.HTMLAttributes<HTMLDivElement>;

const StyledButton = styled.button<IStyledButton>`
  width: ${p => p.width};
  height: fit-content;
  margin: 10px 0;
  padding: 10px 15px;
  border: none;
  border-radius: 50px;

  line-height: 1;
  font-size: 14px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }

  &:disabled {
    opacity: 0.8;
  }

  ${p => (p.theme.variants as any)[p.variant as string]}
  ${p => button_sizes[p.size as string]};

  @media screen and (${p => p.theme.media.mobile}) {
    padding: 10px 25px;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size,
  width,
  icon,
  children,
  type,
  isLoading,
  ...props
}) => (
  <StyledButton
    {...props}
    variant={variant}
    size={size}
    disabled={isLoading}
    width={width}
  >
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

export const ButtonGroup = styled.div<{ float?: string }>`
  float: ${p => p.float || 'initial'};

  > button {
    margin-right: 10px !important;
  }
  @media screen and (${p => p.theme.media.mobile}) {
    > button {
      float: right;
    }
  }
`;

export default Button;
