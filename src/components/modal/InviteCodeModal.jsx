import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import TextInput from '../common/TextInput';
import roomAPI from '../../api/room';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function InviteCodeModal() {
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const [code, setCode] = useState('');

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const handleEnter = () => {
    if (!code) {
      toast.error('코드를 입력해주세요');
      return;
    }
    roomAPI
      .enterRoom(code)
      .then((res) => {
        if (res.data.statusCode === 200) {
          const { roomId } = res.data.data;
          GAEventTrack(GAEventTypes.Category.room, GAEventTypes.Action.room.inviteCodeEnter);
          closeModal();
          navigate(`/room/${roomId}`);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <Modal title="초대 코드" btnText="완료" onConfirm={handleEnter}>
      <TextInput
        autoFocus
        placeholder="초대코드를 입력해주세요"
        value={code}
        onChange={handleChange}
      />
    </Modal>
  );
}

export default InviteCodeModal;
