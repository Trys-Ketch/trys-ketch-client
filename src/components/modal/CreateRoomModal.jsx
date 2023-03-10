import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../common/TextInput';
import roomAPI from '../../api/room';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function CreateRoomModal() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const { closeModal } = useModal();

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCreate = () => {
    const trimedTitle = title.trim();
    if (trimedTitle === '') {
      toast.error('방 제목을 입력해주세요');
      return;
    }
    if (trimedTitle.length < 2) {
      toast.error('2자 이상 입력해주세요');
      return;
    }
    roomAPI
      .createRoom(trimedTitle)
      .then((res) => {
        if (res.data.statusCode === 200) {
          const { roomId } = res.data.data;
          GAEventTrack(GAEventTypes.Category.room, GAEventTypes.Action.room.createRoom);
          navigate(`/room/${roomId}`);
          closeModal();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <Modal title="방 만들기" btnText="만들기" onConfirm={handleCreate}>
      <TextInput
        autoFocus
        maxLength="25"
        placeholder="방 이름을 입력해주세요"
        value={title}
        onChange={handleChange}
      />
    </Modal>
  );
}

export default CreateRoomModal;
