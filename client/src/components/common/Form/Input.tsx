import React from 'react';

import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputLabel = styled.label`
  margin-bottom: ${p => p.theme.spacings.my};
  display: flex;
  /* row-reverse because of :focus + span */
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.common.offwhite};
  border-radius: 50px;
  width: 100%;
  padding: 5px;
  padding: 0 20px;
  height: 40px;
  color: ${p => p.theme.colors.text.black};

  span {
    margin-right: 10px;
    color: ${p => p.theme.colors.text.gray} !important;
    transition: 0.2s;
  }
`

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background: none;
  outline: none;
  &:focus + span {
    border-radius: 50px;
    color: ${p => p.theme.colors.brand.primary} !important;
    transition: 0.2s;
  }

  &::placeholder {
    color: ${p => p.theme.colors.text.gray};
  }
`

interface Props {
  icon: any;
  [x:string]: any;
}

const Input: React.FC<Props> = ({ icon, ...props }) => {
  return (
    <InputLabel>
      <StyledInput type="text" {...props} />
      <span><FontAwesomeIcon icon={icon} /></span>
    </InputLabel>
  )
}

export default Input;