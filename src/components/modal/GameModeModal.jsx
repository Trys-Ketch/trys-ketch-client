import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';

function GameModeModal() {
  const { closeModal } = useModal();
  return (
    <Modal onConfirm={closeModal} hasBtn={false}>
      <DescriptionBox>
        <Subtitle>💧 EASY 모드</Subtitle>
        <Description className="mb">단어 위주로 문제가 제시됩니다.</Description>
        <Subtitle>🔥 HARD 모드</Subtitle>
        <Description>형용사가 들어간 문제가 제시됩니다.</Description>
      </DescriptionBox>
    </Modal>
  );
}

const DescriptionBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 35px;
`;

const Description = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1.5rem;
  margin-left: 25px;

  &.mb {
    margin-bottom: 20px;
  }
`;

const Subtitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 2rem;
`;

export default GameModeModal;
