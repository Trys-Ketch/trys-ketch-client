import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function KickModal(props) {
  const { onKick } = props;
  const { closeModal } = useModal();

  const handleKick = () => {
    onKick();
    GAEventTrack(GAEventTypes.Category.host, GAEventTypes.Action.host.forcedExit);
    closeModal();
    toast.info('추방했습니다');
  };

  return (
    <Modal title="내보내기" btnText="확인" onConfirm={handleKick}>
      <Typography>해당 플레이어를 내보낼까요?</Typography>
    </Modal>
  );
}

const Typography = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
`;

export default KickModal;
