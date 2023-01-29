import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Modal from '../common/Modal';
import TextInput from '../common/TextInput';
import useModal from '../../hooks/useModal';
import Avatar from '../common/Avatar';
import RefreshButton from '../button/RefreshButton';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';
import userAPI from '../../api/user';
import myAPI from '../../api/my';
import { toast } from '../toast/ToastProvider';

function EditProfileModal() {
  const { closeModal } = useModal();
  const { nickname: initialNickname, profileImage: initialProfileImage } = useSelector(
    (state) => state.user,
  );
  const [nickname, setNickname] = useState(initialNickname);
  const [profileImage, setImage] = useState(initialProfileImage);

  const handleChange = (event) => {
    setNickname(event.target.value);
  };

  const getRandomImage = () => {
    GAEventTrack(
      GAEventTypes.Category.userProfile,
      GAEventTypes.Action.userProfile.refreshNickname,
      'member',
    );
    userAPI.getRandomImage().then((res) => {
      setImage(res.data.message);
    });
  };

  const handleEdit = (nickname) => {
    myAPI
      .changeNickname(nickname)
      .then((res) => {
        if (res.data.statusCode === 200) {
          closeModal();
          toast.success('닉네임이 변경되었습니다.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal title="프로필 편집" btnText="완료" onConfirm={() => handleEdit(nickname)}>
      <AvatarBox>
        <Avatar src={profileImage} width="120px" height="120px" />
        <ProfileRefreshButton onClick={getRandomImage} />
      </AvatarBox>
      <TextInput
        autoFocus
        placeholder="변경할 닉네임을 입력해주세요"
        value={nickname}
        onChange={handleChange}
      />
    </Modal>
  );
}

const AvatarBox = styled.div`
  position: relative;
  margin-top: 20px;
`;

const ProfileRefreshButton = styled(RefreshButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default EditProfileModal;