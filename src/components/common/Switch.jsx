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
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 0;
`;

const ToggleSwitch = styled.input`
  z-index: 1;
  width: 5rem;
  height: 2rem;
  background: ${(props) => props.leftBgColor ?? 'gray'};
  border-radius: 2em;
  transition: all 0.2s ease-in-out;

  /* 선택X 텍스트 */
  ::before {
    position: absolute;
    content: '${(props) => props.left ?? ''}';
    padding-left: 1em;
    width: 5rem;
    height: 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${(props) => props.leftColor ?? '#fff'};
    font-weight: 700;
    font-size: 16px;
  }

  /* 선택X 원 */
  ::after {
    position: relative;
    content: '';
    display: block;
    width: 1.6em;
    height: 1.6em;
    top: calc((2rem - 1.6em) / 2);
    left: calc(5rem - 1.9em);
    border-radius: 50%;
    background: ${(props) => props.circleColor ?? '#fff'};
    /* 원 이동 트랜지션 */
  }

  &:checked {
    background: ${(props) => props.rightBgColor ?? '#000'};
    /* 선택 O 텍스트 */
    ::before {
      position: absolute;
      padding-right: 1em;
      content: '${(props) => props.right ?? ''}';
      align-items: center;
      justify-content: flex-end;
      color: ${(props) => props.rightColor ?? '#fff'};
    }
    /* 선택 O 원 */
    ::after {
      content: '';
      z-index: 2;
      top: calc((2rem - 1.6em) / 2);
      left: calc((2rem - 1.6em) / 2);
      width: 1.6em;
      height: 1.6em;
      display: block;
      border-radius: 50%;
      background: ${(props) => props.circleColor ?? '#fff'};
      position: relative;
    }
  }
`;

export default Switch;
