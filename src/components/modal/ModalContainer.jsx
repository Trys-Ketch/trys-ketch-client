import React from 'react';
import { useSelector } from 'react-redux';
import loadable from '@loadable/component';
import { nanoid } from 'nanoid';

const MODAL_COMPONENTS = {
  createRoom: loadable(() => import('./CreateRoomModal')),
  quitRoom: loadable(() => import('./QuitRoomModal')),
  inviteCode: loadable(() => import('./InviteCodeModal')),
  setting: loadable(() => import('./SettingModal')),
  kick: loadable(() => import('./KickModal')),
  editProfile: loadable(() => import('./EditProfileModal')),
  gameMode: loadable(() => import('./GameModeModal')),
  achievement: loadable(() => import('./AchievementModal')),
};

function ModalContainer() {
  const modalList = useSelector((state) => state.modal);

  const renderModal = modalList.map(({ type, props }) => {
    const ModalComponent = MODAL_COMPONENTS[type];
    return <ModalComponent key={nanoid()} id={type} {...props} />;
  });

  return <div className="modals">{renderModal}</div>;
}

export default ModalContainer;
