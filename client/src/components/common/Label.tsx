import React from 'react';
import styled, { css } from 'styled-components/macro';

const Label = styled.div<{ type?: string }>`
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 50px;
  margin-right: 10px;

  ${p =>
    p.type === 'bug' &&
    css`
      color: ${p => p.theme.colors.common.red};
      background-color: ${p => p.theme.colors.common.redlight};
    `}
  ${p =>
    p.type === 'feature' &&
    css`
      color: ${p => p.theme.colors.common.green};
      background-color: ${p => p.theme.colors.common.greenlight};
    `}
  ${p =>
    p.type === 'enhancement' &&
    css`
      color: ${p => p.theme.colors.brand.primary};
      background-color: ${p => p.theme.colors.brand.accent};
    `}
  ${p =>
    p.type === 'help wanted' &&
    css`
      color: ${p => p.theme.colors.brand.primary};
      background-color: ${p => p.theme.colors.brand.accent};
    `}
`;


export const StyledBulletLabel = styled.div<{ type?: string }>`
  font-size: 14px;
  display: flex;
  padding: 5px 10px;
  border-radius: 5px;
  .bullet {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  &:hover {
    background-color: ${p => p.theme.colors.brand.accent};
  }
  ${p =>
    p.type === 'bug' &&
    css`
      color: ${p => p.theme.colors.common.red};
    `}
  ${p =>
    p.type === 'feature' &&
    css`
      color: ${p => p.theme.colors.common.green};
    `}
  ${p =>
    p.type === 'enhancement' &&
    css`
      color: ${p => p.theme.colors.brand.primary};
    `}
  ${p =>
    p.type === 'help wanted' &&
    css`
      color: ${p => p.theme.colors.brand.primary};
    `}
`;

interface BulletLabelProps {
  type: string;
  children: React.ReactNode;
}
export const BulletLabel: React.FC<BulletLabelProps> = ({ type, children }) => {
  return (
    <StyledBulletLabel type={type}>
      <div className="bullet">⚫</div>
      {children}
    </StyledBulletLabel>
  );
};

export default Label;
