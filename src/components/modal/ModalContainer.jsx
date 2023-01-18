import React from 'react';
import { useSelector } from 'react-redux';
import loadable from '@loadable/component';

const MODAL_COMPONENTS = {
  createRoom: loadable(() => import('./CreateRoomModal')),
  quitRoom: loadable(() => import('./QuitRoomModal')),
  inviteCode: loadable(() => import('./InviteCodeModal')),
  setting: loadable(() => import('./SettingModal')),
};

function ModalContainer() {
  const modalList = useSelector((state) => state.modal);

  const renderModal = modalList.map(({ type }) => {
    const ModalComponent = MODAL_COMPONENTS[type];
    return <ModalComponent key={type} />;
  });

  return <div className="modals">{renderModal}</div>;
}

export default ModalContainer;
