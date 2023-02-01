import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';

function GameModeModal() {
  const { closeModal } = useModal();
  return (
    <Modal btnText="확인" onConfirm={closeModal}>
      <BoldText>💧 EASY 모드</BoldText>
      <DescriptionText>{`      단어 위주로 문제가 제시됩니다.`}</DescriptionText>
      <BoldText>🔥 HARD 모드</BoldText>
      <DescriptionText>{`      형용사가 들어간 문제가 제시됩니다.`}</DescriptionText>
    </Modal>
  );
}

const DescriptionText = styled.div`
  white-space: pre-wrap;
  width: 100%;
  font-size: 18px;
  line-height: 1.5rem;
`;

const BoldText = styled.div`
  white-space: pre-wrap;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5rem;
`;

export default GameModeModal;
