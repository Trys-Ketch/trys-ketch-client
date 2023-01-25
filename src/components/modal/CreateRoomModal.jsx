import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../common/TextInput';
import roomAPI from '../../api/room';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';

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
    roomAPI
      .createRoom(trimedTitle)
      .then((res) => {
        if (res.data.statusCode === 200) {
          const { roomId } = res.data.data;
          navigate(`/room/${roomId}`);
          closeModal();
          toast.success('방 생성 완료!');
        }
      })
      .catch((err) => {
        toast.error('에러가 발생했습니다.');
      });
  };

  return (
    <Modal title="방 만들기" btnText="만들기" onConfirm={handleCreate}>
      <TextInput
        autoFocus
        maxlength="15"
        placeholder="방 이름을 입력해주세요"
        value={title}
        onChange={handleChange}
      />
    </Modal>
  );
}

export default CreateRoomModal;
