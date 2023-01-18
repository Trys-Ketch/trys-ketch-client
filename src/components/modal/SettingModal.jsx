import React from 'react';
import Modal from '../common/Modal';
import Switch from '../common/Switch';
import Range from '../common/Range';
import useModal from '../../hooks/useModal';

function SettingModal() {
  const { closeModal } = useModal();

  const handleEnter = () => {
    alert(`설정:`);
    closeModal();
  };

  return (
    <Modal title="설정" btnText="완료" onConfirm={handleEnter}>
      <Switch />
      <Range />
      <Range />
    </Modal>
  );
}

export default SettingModal;
