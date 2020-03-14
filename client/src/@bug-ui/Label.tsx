import React from 'react';
import styled from 'styled-components/macro';

const VARIANTS_MAP: any = {
  'help wanted': 'secondary',
  enhancement: 'secondary',
  feature: 'success',
  bug: 'danger'
};

interface LabelProps {
  type: 'bug' | 'feature' | 'help wanted' | 'enhancement' | string | null;
  children: React.ReactNode;
  [x: string]: any;
}
interface StyledLabelProps {
  variant: string;
}
export const StyledLabel = styled.div<StyledLabelProps>`
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 50px;
  margin-bottom: 5px;
  width: fit-content;
  line-height: 1;

  ${p => (p.theme.variants as any)[p.variant]}
`;

export const StyledBulletLabel = styled(StyledLabel)`
  display: flex;
  border-radius: 5px;
  margin-bottom: 0px;
  width: 100%;
  padding: 10px;
  background-color: transparent;

  .bullet {
    width: 10px;
    height: 10px;
    margin-top: 2px;
    margin-right: 8px;
    border-radius: 50px;
    &.danger {
      background-color: ${p => p.theme.colors.red};
    }
    &.success {
      background-color: ${p => p.theme.colors.green};
    }
    &.secondary {
      background-color: ${p => p.theme.colors.primary};
    }
  }
`;

export const Label: React.FC<LabelProps> = ({ children, type }) => {
  return (
    <StyledLabel variant={VARIANTS_MAP[type as string]}>{children}</StyledLabel>
  );
};

export const BulletLabel: React.FC<LabelProps> = ({ type, children }) => {
  return (
    <StyledBulletLabel variant={VARIANTS_MAP[type as string]}>
      <div className={`bullet ${VARIANTS_MAP[type as string]}`} />
      {children}
    </StyledBulletLabel>
  );
};

export default Label;
