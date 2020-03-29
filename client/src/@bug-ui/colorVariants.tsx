import { css } from 'styled-components';

const danger = css`
  color: ${p => p.theme.colors.red};
  background-color: ${p => p.theme.colors.redlight};
`;
const success = css`
  color: ${p => p.theme.colors.green};
  background-color: ${p => p.theme.colors.greenlight};
`;
const primary = css`
  color: ${p => p.theme.colors.accent};
  background-color: ${p => p.theme.colors.primary};
`;
const secondary = css`
  color: ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.accent};
`;

export type VariantTypes = 'primary' | 'success' | 'danger' | 'secondary';
export const colorVariants: any = {
  danger,
  success,
  primary,
  secondary
};

export default colorVariants;
