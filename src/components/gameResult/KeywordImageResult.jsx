import { nanoid } from 'nanoid';
import React from 'react';
import styled from 'styled-components';
import ImageResult from './ImageResult';
import KeywordResult from './KeywordResult';

function KeywordImageResult({ isLoading, resultArray, nowKeywordIndex, member }) {
  return (
    <div>
      {isLoading
        ? null
        : resultArray[nowKeywordIndex].map((result, idx) => {
            if (idx % 2 === 0)
              return (
                <KeywordResult
                  key={`keyword-${nanoid()}`}
                  nickname={result.nickname}
                  userImg={result.userImgPath}
                  keyword={result.keyword !== 'null' ? result.keyword : '미제출'}
                />
              );
            return (
              <ImageResult
                key={`image-${result.imgId}`}
                member={member}
                nickname={result.nickname}
                imgId={result.imgId}
                img={result.imgPath}
                userImg={result.userImgPath}
              />
            );
          })}
    </div>
  );
}

export default KeywordImageResult;
