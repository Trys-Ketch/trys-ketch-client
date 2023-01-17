import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../common/Modal';
import roomAPI from '../../api/room';

function QuitRoomModal() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleQuit = () => {
    roomAPI
      .exitRoom(id)
      .then((res) => {
        if (res.data.statusCode === 200) {
          alert(res.data.message);
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal title="방 나가기" btnText="나가기" onConfirm={handleQuit}>
      방을 나가시겠습니까?
    </Modal>
  );
}

export default QuitRoomModal;
