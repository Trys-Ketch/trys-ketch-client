import React from 'react';
import styled from 'styled-components';

function KeywordResult({ nickname, userImg, keyword }) {
  return (
    <StKeywordResult>
      <KeywordNickname>{nickname}</KeywordNickname>
      <KeywordWrapper>
        <ProfileImg src={userImg} alt="profile" />
        <Keyword>{keyword !== 'null' ? keyword : '미제출'}</Keyword>
      </KeywordWrapper>
    </StKeywordResult>
  );
}

const StKeywordResult = styled.div``;

const KeywordWrapper = styled.div`
  margin-top: 10px;
  align-items: center;
  display: flex;
`;

const KeywordNickname = styled.div`
  width: max-content;
  margin-left: 65px;
  margin-top: 18px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const Keyword = styled.pre`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  display: block;
  width: max-content;
  padding: 15px;
  margin-left: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
  line-height: 20px;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;

export default KeywordResult;
