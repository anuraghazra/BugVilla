import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VariantTypes } from './colorVariants';

interface StyledCircleProps {
  variant: VariantTypes;
  size?: string | undefined;
}
export const StyledCircleIcon = styled.div<StyledCircleProps>`
  font-size: 14px;
  border-radius: 50px;
  min-width: ${p => p.size || '40px'};
  min-height: ${p => p.size || '40px'};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  ${p => (p.theme.variants as any)[p.variant as string]}
`;

interface CircleIconProps {
  variant?: VariantTypes;
  icon: any;
  size?: string;
  [x: string]: any;
}
export const CircleIcon: React.FC<CircleIconProps> = ({
  icon,
  variant = 'secondary',
  size,
  ...props
}) => {
  return (
    <StyledCircleIcon size={size} variant={variant} {...props}>
      <FontAwesomeIcon icon={icon} />
    </StyledCircleIcon>
  );
};

export default CircleIcon;
