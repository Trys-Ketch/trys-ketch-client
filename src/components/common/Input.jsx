import React from 'react';
import styled from 'styled-components';

const InputBlock = styled.input`
  width: ${(props) => props.width || '100%'};
  height: 3.5rem;
  font-size: 1rem;
  text-indent: 12px;
  border: none;
  border-radius: 10px;
  background-color: '#FFFAF0';

  &:focus {
    outline: none;
    /* border-color: blue; */
  }

  &::placeholder {
    color: '#746B5F';
    opacity: 50%;
    font-size: 0.9rem;
  }
`;

function Input({ placeholder, onChange, value, width, ...rest }) {
  const htmlProps = rest;
  return (
    <InputBlock
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      width={width}
      {...htmlProps}
    />
  );
}

export default Input;
