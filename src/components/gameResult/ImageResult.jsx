import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Download from '../../assets/icons/download-icon.svg';
import EmptyLike from '../../assets/icons/empty-like-icon.svg';
import Like from '../../assets/icons/like-icon.svg';
import { toast } from '../toast/ToastProvider';
import myAPI from '../../api/my';

function ImageResult({ member, nickname, imgId, img, userImg }) {
  const [like, setLike] = useState(false);

  const handleLike = () => {
    myAPI
      .imageToggleLike(imgId)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setLike(res.data.data.isLike);
          if (res.data.data.isLike) {
            toast.success('좋아요하셨습니다');
          } else {
            toast.info('좋아요 취소하셨습니다');
          }
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const downloadImage = async () => {
    axios.get(img, { responseType: 'blob' }).then(async (res) => {
      saveAs(res.data, `trys-ketch-${nickname}.png`);
    });
  };

  return (
    <div key={`image-${imgId}`}>
      <ImageNickname>{nickname}</ImageNickname>
      <ImageContainer>
        <ImageWrapper>
          {member !== 'guest' && (
            <>
              {/* <DownloadButton onClick={downloadImage}> */}
              <DownloadButton onClick={() => downloadImage()}>
                <img src={Download} alt="download" />
              </DownloadButton>
              <LikeButton onClick={handleLike}>
                {like ? <img src={Like} alt="like" /> : <img src={EmptyLike} alt="like" />}
              </LikeButton>
            </>
          )}
          <Image src={img} alt="img" />
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
  cursor: pointer;
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
  height: 227px;
  aspect-ratio: auto 1/1;
  background-color: white;
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
`;

export default ImageResult;
