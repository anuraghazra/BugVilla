import React from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage } from 'react-hook-form';

interface InputLabelProps {
  indicateError?: boolean;
}
const InputLabel = styled.label<InputLabelProps>`
  display: flex;
  /* row-reverse because of :focus + span */
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;

  background-color: ${p => p.theme.colors.offwhite};
  border: 1px solid
    ${p => (p.indicateError ? p.theme.colors.red : 'transparent')};

  border-radius: 50px;
  height: 40px;
  padding: ${p => p.theme.space.small}px;
  padding: 0 20px;
  color: ${p => p.theme.colors.black};

  span {
    color: ${p => p.theme.colors.gray} !important;
    transition: 0.2s;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: none;
  margin-left: 10px;
  padding: 10px;
  &:focus + span {
    color: ${p => p.theme.colors.primary} !important;
    border-radius: 50px;
    transition: 0.2s;
  }

  &::placeholder {
    color: ${p => p.theme.colors.gray};
  }
`;

export const Textarea = styled(StyledInput).attrs(p => ({ as: 'textarea' }))`
  padding: ${p => p.theme.space.medium}px;
  margin: 0;
  outline: 2px solid ${p => p.theme.colors.accent};
`;

export const InputWrapper = styled.div`
  margin-bottom: 10px;
  width: 100%;

  .text--error {
    font-size: 12px;
    margin-top: 5px;
    margin-left: 16px;
    transition: 0.3s;
    transform: translateY(-20px);
    opacity: 0;

    &:before {
      content: '* ';
    }
  }
  .show-error {
    transform: translateY(0);
    opacity: 1;
    transition: 0.3s;
  }
`;

interface InputProps {
  icon: any;
  inputRef?: any;
  errors?: any;
  [x: string]: any;
}

export const Input: React.FC<InputProps> = ({
  icon,
  errors,
  inputRef,
  ...props
}) => {
  return (
    <InputWrapper>
      <InputLabel indicateError={errors && errors[props.name]}>
        <StyledInput type="text" ref={inputRef} {...props} />
        <span>
          <FontAwesomeIcon data-testid="icon" icon={icon} />
        </span>
      </InputLabel>
      {errors && (
        <div
          data-testid="input-error"
          className={`text--error ${errors[props.name] && 'show-error'}`}
        >
          <ErrorMessage errors={errors} name={props.name} />
        </div>
      )}
    </InputWrapper>
  );
};

export default Input;
