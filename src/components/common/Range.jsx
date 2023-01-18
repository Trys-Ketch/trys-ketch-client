import React from 'react';
import styled from 'styled-components';

function Range({ min, max, value, onChange }) {
  return <InputRange type="range" min={min} max={max} value={value} onChange={onChange} />;
}

const InputRange = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 700px;
  width: 100%;
  margin: 0;
  height: 10px;
  cursor: pointer;
  background: #4e473f;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    background: '#4e473f';
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: 36px;
    width: 36px;
    background: '#4e473f';
    border-radius: 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 150ms;
  }

  &::-moz-range-track,
  &::-moz-range-progress {
    width: 100%;
    height: 36px;
    background: #edf5f9;
  }

  &::-moz-range-progress {
    background: #0199ff;
  }

  &::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: 36;
    width: 36;
    background: '#4e473f';
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: 36px;
    border: 0;
    /* color needed to hide track marks */
    color: transparent;
    background: transparent;
  }

  &::-ms-fill-lower {
    background: #0199ff;
  }

  &::-ms-fill-upper {
    background: #edf5f9;
  }

  &::-ms-thumb {
    appearance: none;
    height: 36;
    width: 36;
    background: '#4e473f';
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    margin: 0;
    box-shadow: none;
  }
`;

export default Range;
