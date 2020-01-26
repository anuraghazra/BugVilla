import React from 'react';
import { fireEvent } from '@testing-library/react';
import BaseDropdown from 'components/common/BaseDropdown';
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
    expect(dropdownContent).toHaveStyle(`opacity: 1`);

    fireEvent.click(toggleButton);
    expect(dropdownContent).toHaveStyle(`opacity: 0`);

    // click outside
    fireEvent.click(toggleButton);
    fireEvent.click(document.body);
    expect(dropdownContent).toHaveStyle(`opacity: 0`);
  });
});
