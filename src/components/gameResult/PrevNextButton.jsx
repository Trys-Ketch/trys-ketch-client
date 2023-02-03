import React from 'react';
import styled, { css } from 'styled-components';
import arrow from '../../assets/icons/right-arrow.svg';

function PrevNextButton({ isPrev, isNext, isLast, handleChange }) {
  return (
    <ArrowButton isPrev={isPrev} onClick={() => handleChange()}>
      {isNext && '다음'}
      {isLast && '게임 종료'}
      <ArrowImg isPrev={isPrev} src={arrow} alt="prev" />
      {isPrev && '이전'}
    </ArrowButton>
  );
}

const ArrowImg = styled.img`
  height: '80%';
  aspect-ratio: 'auto';
  vertical-align: 'middle';
  margin: 'auto 0';

  ${(props) =>
    props.isPrev
      ? css`
          transform: scaleX(-1);
          margin-right: 10px;
        `
      : css`
          margin-left: 10px;
        `}
`;

const ArrowButton = styled.button`
  height: 50px;
  line-height: 50px;
  width: max-content;
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #746b5f;
  cursor: pointer;

  ${(props) =>
    props.isPrev
      ? css`
          margin-right: auto;
        `
      : css`
          margin-left: auto;
        `}
`;

export default PrevNextButton;
