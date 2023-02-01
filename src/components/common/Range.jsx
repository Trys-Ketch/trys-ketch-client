import React from 'react';
import styled from 'styled-components';

function Range({ width, min, max, value, onChange, ...rest }) {
  const htmlProps = rest;
  return (
    <InputRange
      type="range"
      width={width}
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      {...htmlProps}
    />
  );
}

const InputRange = styled.input`
  width: ${(props) => props.width || '100%'};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.DIM_GRAY};
  border-color: ${({ theme }) => theme.colors.DIM_GRAY};
  accent-color: ${({ theme }) => theme.colors.DIM_GRAY};
  color: ${({ theme }) => theme.colors.DIM_GRAY};

  &:focus {
    outline: none;
  }
`;

export default Range;
