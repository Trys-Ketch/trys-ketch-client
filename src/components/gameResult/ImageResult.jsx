import React from 'react';
import styled from 'styled-components';
import Download from '../../assets/icons/download-icon.svg';
import EmptyLike from '../../assets/icons/empty-like-icon.svg';
import Like from '../../assets/icons/like-icon.svg';

function ImageResult({ nickname, imgId, img, userImg }) {
  // TODO - 좋아요 api 추가
  return (
    <div key={`image-${imgId}`}>
      <ImageNickname>{nickname}</ImageNickname>
      <ImageContainer>
        <ImageWrapper>
          <DownloadButton>
            <img src={Download} alt="download" />
          </DownloadButton>
          <Image src={img} alt="img" />
          <LikeButton>
            <img src={Like} alt="like" />
          </LikeButton>
        </ImageWrapper>
        <ProfileImg src={userImg} alt="profile" />
      </ImageContainer>
    </div>
  );
}

const ImageContainer = styled.div`
  display: flex;
`;

const ImageNickname = styled.div`
  margin-right: 65px;
  margin-left: auto;
  width: max-content;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
`;

const IconButton = styled.button`
  & img {
  }
`;

const LikeButton = styled(IconButton)`
  position: absolute;
  top: 27px;
  right: 27px;
`;

const DownloadButton = styled(IconButton)`
  position: absolute;
  bottom: 0;
  left: -40px;
`;

const ImageWrapper = styled.div`
  position: relative;
  font-family: 'TTTogether';
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  padding: 15px;
  width: max-content;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-top: 10px;
  margin-left: auto;
  margin-right: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
`;

const Image = styled.img`
  margin-left: auto;
  width: 400px;
  aspect-ratio: auto 1/1;
  background-color: white;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;

export default ImageResult;
