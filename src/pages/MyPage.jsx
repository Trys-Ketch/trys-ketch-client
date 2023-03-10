import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Container from '../components/layout/Container';
import MyProfile from '../components/user/MyProfile';
import FloatBox from '../components/layout/FloatBox';
import SettingButton from '../components/button/SettingButton';
import logout from '../assets/icons/logout-icon.svg';
import arrow from '../assets/icons/right-arrow.svg';
import { delCookie } from '../utils/cookie';
import { toast } from '../components/toast/ToastProvider';
import FlatButton from '../components/common/FlatButton';
import Tab from '../components/common/Tab';
import MyBadge from '../components/mypage/MyBadge';
import MyImage from '../components/mypage/MyImage';
import myAPI from '../api/my';
import MyImageLock from '../components/mypage/MyImageLock';
import MyBadgeLock from '../components/mypage/MyBadgeLock';
import ZoomInCanvas from '../components/mypage/ZoomInCanvas';
import authAPI from '../api/auth';

function MyPage() {
  const navigate = useNavigate();
  const { member } = useSelector((state) => state.login);
  // 뱃지
  const [myBadges, setMyBadges] = useState({});

  // 좋아요한 이미지
  const [myImages, setMyImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  let menus;

  const getBadge = () => {
    myAPI.getBadge().then((res) => {
      if (res.data.statusCode === 200) {
        setMyBadges(res.data.data);
      }
    });
  };

  const getLikedNextImages = () => {
    setFetching(true);
    myAPI.getLikedImages(page).then((res) => {
      if (res.data) {
        const { image, lastPage } = res.data;
        setMyImages(myImages.concat(image));
        setPage(page + 1);
        setNextPage(page !== lastPage);
        setFetching(false);
      }
    });
  };

  const goToLobby = () => {
    navigate('/');
  };

  const handleLogout = () => {
    if (member === 'guest') delCookie('guest');
    else {
      delCookie();
      authAPI.delRefreshToken();
    }
    toast.success('로그아웃되었습니다');
    navigate('/login');
  };

  const handleUnselect = () => {
    setSelected(null);
  };

  if (member === 'guest') {
    menus = [
      { menu: '나의 뱃지', content: <MyBadgeLock /> },
      { menu: '좋아요한 이미지', content: <MyImageLock /> },
    ];
  } else {
    menus = [
      { menu: '나의 뱃지', content: <MyBadge badges={myBadges} fetchBadge={getBadge} /> },
      {
        menu: '좋아요한 이미지',
        content: (
          <MyImage
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            fetchNextImage={getLikedNextImages}
            images={myImages}
            setSelected={setSelected}
          />
        ),
      },
    ];
  }

  return (
    <>
      <FloatBox top={<SettingButton size="xlarge" />} />
      <Container>
        <BackButton onClick={goToLobby}>
          <img src={arrow} alt="back" />
        </BackButton>
        <MyProfileArea>
          <MyProfile />
          <FlatButton size="small" onClick={handleLogout}>
            <img src={logout} alt="logout" /> 로그아웃
          </FlatButton>
        </MyProfileArea>
        <MyArea>
          <Tab menu={menus} />
        </MyArea>
      </Container>
      <AnimatePresence mode="wait" onExitComplete={() => null}>
        {selected && <ZoomInCanvas selected={selected} onClose={handleUnselect} />}
      </AnimatePresence>
    </>
  );
}

const BackButton = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 15px 10px;
  cursor: pointer;

  & img {
    width: 30px;
    height: 30px;
    transform: rotate(180deg);
  }
`;

const MyProfileArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 10px;
  margin-right: 10px;
  width: 20%;
  height: 100%;
`;

const MyArea = styled.div`
  width: 80%;
  height: 100%;
  ${({ theme }) => theme.common.flexCenterColumn};
  background: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-radius: 10px;
  padding: 10px;
`;

export default MyPage;
