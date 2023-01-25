import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import userAPI from '../../api/user';
import { setUserInfo } from '../../app/slices/userSlice';
import { delCookie } from '../../utils/cookie';
import { toast } from '../toast/ToastProvider';

function LobbyProfile() {
  const { profileImage, nickname } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserInfo = () => {
    userAPI
      .getUserInfo()
      .then((res) => {
        if (res.data.statusCode === 200) {
          const { id, nickname, imgUrl } = res.data.data;
          const payload = {
            profileImage: imgUrl,
            userId: id,
            nickname,
          };
          dispatch(setUserInfo(payload));
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        // 500, 401 처리
        if (err.response.status === 401) {
          delCookie();
          delCookie('guest');
          toast.error('로그인 이후 이용해주세요');
        } else {
          toast.error('에러가 발생했습니다.');
        }
        navigate('/login');
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <ProfileBox>
      <Avatar src={profileImage} width="80px" height="80px" />
      <Nickname>{nickname}</Nickname>
    </ProfileBox>
  );
}

const ProfileBox = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const Nickname = styled.h3`
  font-family: 'Pretendard';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  margin: 10px 0 20px 0;
`;

export default LobbyProfile;
