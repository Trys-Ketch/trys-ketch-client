import React from 'react';
import styled from 'styled-components';

function Switch() {
  return (
    <Wrapper>
      <ToggleSwitch type="checkbox" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 70px;
  /* width: 80px; */
  height: auto;
  top: 50%;
  left: 50%;
`;

const ToggleSwitch = styled.input`
  position: relative;
  width: 100%;
  background: gainsboro;
  -webkit-appearance: none;
  height: 40px;
  outline: none;
  border-radius: 30px;
  box-shadow: inset 0px 0px 0px 3px rgb(255 255 255);
  transition: 0.5s;

  &:checked {
    background: #a2ee00;
  }

  &:before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    left: 1px;
    background: #746b5f;
    box-shadow: 0px 1px 6px 1px gainsboro;
    border-radius: 50%;
    top: 0px;
    transform: scale(0.9);
    transition: 0.5s;
  }

  &:checked:before {
    left: 29px;
  }
`;

export default Switch;
