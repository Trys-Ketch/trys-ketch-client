import React from 'react';
import styled, { css } from 'styled-components';
import TextInput from '../common/TextInput';

function KeywordArea({
  isDrawingState,
  keyword,
  isKeywordState,
  isGuessingState,
  setKeyword,
  isSubmitted,
}) {
  function onKeywordChangeHandler(event) {
    setKeyword(event.target.value);
  }
  return (
    <KeywordDiv isDrawingState={isDrawingState}>
      {isDrawingState ? (
        <Keyword>{keyword}</Keyword>
      ) : (
        <Keyword>
          {isKeywordState && '키워드를 입력해주세요: '}
          {isGuessingState && '정답을 맞춰주세요: '}
          <TextInput
            value={keyword}
            onChange={(event) => onKeywordChangeHandler(event)}
            width="400px"
            backgroundColor="#c9dbaa"
            readOnly={isSubmitted}
          />
        </Keyword>
      )}
    </KeywordDiv>
  );
}

const KeywordDiv = styled.div`
  line-height: 100%;
  width: 100%;
  height: 15%;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};

  ${(props) =>
    props.isDrawingState
      ? css`
          margin-bottom: 2%;
        `
      : css`
          position: absolute;
          bottom: 0;
        `}
`;

const Keyword = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  text-align: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

export default KeywordArea;
