import { css } from 'styled-components';

const danger = css`
  color: ${p => p.theme.colors.common.red};
  background-color: ${p => p.theme.colors.common.redlight};
`;
const success = css`
  color: ${p => p.theme.colors.common.green};
  background-color: ${p => p.theme.colors.common.greenlight};
`;
const primary = css`
  color: ${p => p.theme.colors.brand.accent};
  background-color: ${p => p.theme.colors.brand.primary};
`;
const secondary = css`
  color: ${p => p.theme.colors.brand.primary};
  background-color: ${p => p.theme.colors.brand.accent};
`;

export const colorVariants: any = {
  danger,
  success,
  primary,
  secondary
};

export default colorVariants;
