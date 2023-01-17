import React from 'react';
import styled from 'styled-components';

const InputBlock = styled.input`
  width: ${(props) => props.width || '100%'};
  height: 3.5rem;
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-indent: 12px;
  border: none;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE2};

  &:focus {
    outline: none;
    /* border-color: blue; */
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.DIM_GRAY};
    opacity: 50%;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

function TextInput({ placeholder, onChange, value, width, maxlength, ...rest }) {
  const htmlProps = rest;
  return (
    <InputBlock
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      width={width}
      maxlength={maxlength}
      {...htmlProps}
    />
  );
}

export default TextInput;
