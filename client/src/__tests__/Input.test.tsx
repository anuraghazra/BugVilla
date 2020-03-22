import React from 'react';
import userEvent from '@testing-library/user-event';

import { renderWithStyledTheme } from 'utils/test-utils';
import { Input } from '@bug-ui/Form';

describe('Input', () => {
  it('should renders <Input>', () => {
    let errors = {};
    const register = jest.fn();

    const { getByPlaceholderText, getByTestId } = renderWithStyledTheme(
      <Input
        name="email"
        type="email"
        icon="envelope"
        placeholder="example@gmail.com"
        errors={errors}
        inputRef={register({ required: 'Email is required' })}
      />
    );

    const input = getByPlaceholderText('example@gmail.com');
    userEvent.type(input, 'test@gmail.com');
    expect(input).toHaveValue('test@gmail.com');

    expect(getByTestId('icon')).toHaveAttribute(
      'class',
      expect.stringContaining('envelope')
    );
  });

  it('should check if <Input> shows error msg', () => {
    let errors = { email: 'email is invalid' };
    const register = jest.fn();

    const { getByTestId } = renderWithStyledTheme(
      <Input
        name="email"
        type="email"
        icon="envelope"
        placeholder="example@gmail.com"
        errors={errors}
        inputRef={register({ required: 'Email is required' })}
      />
    );

    const errorMessage = getByTestId('input-error');
    expect(errorMessage).toHaveClass('text--error show-error');
  });
});
