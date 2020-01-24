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

  background-color: ${p => p.theme.colors.common.offwhite};
  border: 1px solid
    ${p => (p.indicateError ? p.theme.colors.common.red : 'transparent')};

  border-radius: 50px;
  height: 40px;
  padding: 5px;
  padding: 0 20px;
  color: ${p => p.theme.colors.text.black};

  span {
    color: ${p => p.theme.colors.text.gray} !important;
    transition: 0.2s;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: none;
  margin-left: 10px;

  &:focus + span {
    color: ${p => p.theme.colors.brand.primary} !important;
    border-radius: 50px;
    transition: 0.2s;
  }

  &::placeholder {
    color: ${p => p.theme.colors.text.gray};
  }
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

const Input: React.FC<InputProps> = ({ icon, errors, inputRef, ...props }) => {
  return (
    <InputWrapper>
      <InputLabel indicateError={errors && errors[props.name]}>
        <StyledInput type="text" ref={inputRef} {...props} />
        <span>
          <FontAwesomeIcon icon={icon} />
        </span>
      </InputLabel>
      {errors && (
        <div className={`text--error ${errors[props.name] && 'show-error'}`}>
          <ErrorMessage errors={errors} name={props.name} />
        </div>
      )}
    </InputWrapper>
  );
};

export default Input;
