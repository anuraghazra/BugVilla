import React from 'react';
import { fireEvent } from '@testing-library/react';
import { BaseDropdown } from '@bug-ui';
import { renderWithStyledTheme } from 'utils/test-utils';

describe('BaseDropdown', () => {
  it('should renders <BaseDropdown>', () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <BaseDropdown
        trigger={toggle => <button onClick={toggle}>Toggle</button>}
      >
        <div>Hey I'm dropdown content</div>
      </BaseDropdown>
    );

    const toggleButton = getByText('Toggle');
    const dropdownContent = getByTestId('dropdown-content');

    expect(dropdownContent).toHaveTextContent("Hey I'm dropdown content");

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).not.toBeVisible();

    // click outside
    fireEvent.click(toggleButton);
    fireEvent.click(document.body);
    expect(dropdownContent).not.toBeVisible();
  });
});
