import React from 'react';
import { render } from '@testing-library/react';
import theme from 'theme';
import { ThemeProvider } from 'styled-components';

export function renderWithStyledTheme(component: React.ReactNode) {
  return {
    ...render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
  };
}
