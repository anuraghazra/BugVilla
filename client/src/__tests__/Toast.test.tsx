import React from 'react';
import { fireEvent, wait } from '@testing-library/react';
import Toast from 'components/common/Toast';
import { renderWithStyledTheme } from 'utils/test-utils';

describe('Toast', () => {
  it('should renders <Toast>', () => {
    const { getByText } = renderWithStyledTheme(
      <Toast message={'this is toast'} isVisible>
        Hello world
      </Toast>
    );
    expect(getByText('this is toast')).toBeInTheDocument();
  });

  it('should toggle visibility', async () => {
    const { container, rerender } = renderWithStyledTheme(
      <Toast message={''} isVisible={false} />
    );
    const toast = container.firstChild;
    expect(toast).not.toBeVisible();
    renderWithStyledTheme(
      <Toast message={'this is toast'} isVisible={true} />,
      rerender
    );
    expect(toast).toBeVisible();
    fireEvent.click(container.querySelector('svg[data-icon=times]') as any);
    expect(toast).not.toBeVisible();
  });

  it('should disappear after delay', async () => {
    const { container } = renderWithStyledTheme(
      <Toast message={'this is toast'} isVisible>
        Hello world
      </Toast>
    );
    expect(container.firstChild).toBeVisible();

    await wait(() => {
      expect(container.firstChild).not.toBeVisible();
    });
  });
});
