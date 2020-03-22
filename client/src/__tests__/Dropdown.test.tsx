import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Dropdown } from '@bug-ui';
import { renderWithStyledTheme } from 'utils/test-utils';

describe('Dropdown', () => {
  it('should renders & Toggle <Dropdown> ', () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          <button>Click to toggle</button>
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/Click to toggle/i);
    const dropdownContent = getByTestId('dropdown-content');

    expect(dropdownContent).toHaveTextContent('dropdown content');

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).not.toBeVisible();

    // click again
    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    // click outside
    fireEvent.click(document.body);
    expect(dropdownContent).not.toBeVisible();
  });

  it('<Dropdown.Toggle> should work with renderProp', () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          {toggle => (
            <span>
              <button>
                Click to <span onClick={toggle}>toggle</span>
              </button>
            </span>
          )}
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/toggle/i, 'span');
    const dropdownContent = getByTestId('dropdown-content');
    expect(dropdownContent).toHaveTextContent('dropdown content');

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).not.toBeVisible();
  });

  it('should handle multiple <Dropdown.Toggle> & <Dropdown.Content>', () => {
    const { getByText } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          {toggle => (
            <button>
              <span onClick={toggle}>First Toggle</span>
            </button>
          )}
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
          <Dropdown.Toggle>
            <button>2nd Toggle, Inside Content</button>
          </Dropdown.Toggle>
        </Dropdown.Content>
        <Dropdown.Content>
          <div>second content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/First Toggle/i, 'span');
    const toggleButton2 = getByText(/2nd Toggle, Inside Content/i, 'span');
    const dropdownContent = getByText(/dropdown content/i);
    const dropdownContent2 = getByText(/second content/i);
    expect(dropdownContent).toHaveTextContent('dropdown content');

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    fireEvent.click(toggleButton2);
    expect(dropdownContent).not.toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent2).toBeVisible();
  });
});
