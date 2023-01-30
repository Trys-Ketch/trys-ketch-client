import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';

function QuitRoomModal() {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleQuit = () => {
    closeModal();
    navigate('/', { replace: true });
  };

  return (
    <Modal title="방 나가기" btnText="나가기" onConfirm={handleQuit}>
      방을 나가시겠습니까?
    </Modal>
  );
}

export default QuitRoomModal;
