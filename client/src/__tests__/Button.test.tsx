import React from 'react';

import Button from 'components/common/Button';
import { renderWithStyledTheme } from 'utils/test-utils';

describe('Button', () => {
  it('should renders <Button>', () => {
    const { getByText } = renderWithStyledTheme(<Button>Hello world</Button>);
    expect(getByText('Hello world')).toBeInTheDocument();
  });

  it('should renders <Button> with icon', () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <Button icon="cog">Hello world</Button>
    );
    expect(getByText('Hello world')).toBeInTheDocument();
    expect(getByTestId('icon')).toHaveAttribute(
      'class',
      expect.stringContaining('cog')
    );
  });

  it('should renders <Button> with loading spinner', () => {
    const { getByTestId } = renderWithStyledTheme(
      <Button icon="cog" isLoading>
        Hello world
      </Button>
    );
    expect(getByTestId('icon')).toHaveAttribute(
      'class',
      expect.stringContaining('spinner')
    );
  });
});
