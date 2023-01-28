import React from 'react';
import setting from '../../assets/icons/setting-icon.svg';
import IconButton from '../common/IconButton';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';

function SettingButton({ size }) {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    // openModal({ type: 'setting' });
    toast.info('준비중이에요 🔨');
  };

  return <IconButton size={size} icon={setting} text="설정" onClick={handleOpenModal} />;
}

export default SettingButton;
