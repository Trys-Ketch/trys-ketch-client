import React, { useState } from 'react';
import Modal from '../common/Modal';
import TextInput from '../common/TextInput';

function InviteCodeModal() {
  const [code, setCode] = useState('');

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const handleEnter = () => {
    alert(`초대코드: ${code}`);
  };

  return (
    <Modal title="초대 코드" btnText="완료" onConfirm={handleEnter}>
      <TextInput placeholder="초대코드를 입력해주세요" value={code} onChange={handleChange} />
    </Modal>
  );
}

export default InviteCodeModal;
