import React from 'react';
import { renderWithStyledTheme } from 'utils/test-utils';
import Tooltip from 'components/common/Tooltip';

describe('Tooltip', () => {
  it('should renders <Tooltip>', () => {
    const { getByText } = renderWithStyledTheme(
      <Tooltip content={'Tooltip content'}>Hover to open tooltip</Tooltip>
    );
    expect(getByText('Hover to open tooltip')).toBeInTheDocument();
    expect(getByText('Tooltip content')).not.toBeVisible();
  });
});
