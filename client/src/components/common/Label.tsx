import React from 'react';
import styled, { css } from 'styled-components/macro';

const StyledLabel = styled.div`
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 50px;
  margin-right: 10px;

  &.bug {
    color: ${p => p.theme.colors.common.red};
    &--bg {
      background-color: ${p => p.theme.colors.common.redlight};
    }
  }
  &.feature {
    color: ${p => p.theme.colors.common.green};
    &--bg {
      background-color: ${p => p.theme.colors.common.greenlight};
    }
  }
  &.enhancement {
    color: ${p => p.theme.colors.brand.primary};
    &--bg {
      background-color: ${p => p.theme.colors.brand.accent};
    }
  }
  &.help-wanted {
    color: ${p => p.theme.colors.brand.primary};
    &--bg {
      background-color: ${p => p.theme.colors.brand.accent};
    }
  }
`;

export const StyledBulletLabel = styled(StyledLabel)`
  font-size: 14px;
  display: flex;
  padding: 5px 10px;
  border-radius: 5px;

  .bullet {
    width: 10px;
    height: 10px;
    margin-top: 7px;
    margin-right: 8px;
    border-radius: 50px;
    &.bug {
      background-color: ${p => p.theme.colors.common.red};
    }
    &.feature {
      background-color: ${p => p.theme.colors.common.green};
    }
    &.enhancement {
      background-color: ${p => p.theme.colors.brand.primary};
    }
    &.help-wanted {
      background-color: ${p => p.theme.colors.brand.primary};
    }
  }
  & {
    background-color: none !important;
  }
`;

interface LabelProps {
  type: string;
  children: React.ReactNode;
  [x: string]: any;
}
const Label: React.FC<LabelProps> = ({ children, type }) => {
  const labelType = type.replace(/\s/, '-');
  return (
    <StyledLabel className={`${labelType} ${labelType}--bg`}>
      {children}
    </StyledLabel>
  );
};

export const BulletLabel: React.FC<LabelProps> = ({ type, children }) => {
  const labelType = type.replace(/\s/, '-');

  return (
    <StyledBulletLabel className={labelType}>
      <div className={'bullet ' + labelType}></div>
      {children}
    </StyledBulletLabel>
  );
};

export default Label;
