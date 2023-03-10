import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';

function GameModeModal() {
  const { closeModal } = useModal();
  return (
    <Modal onConfirm={closeModal} hasBtn={false}>
      <DescriptionBox>
        <Subtitle>π§ EASY λͺ¨λ</Subtitle>
        <Description className="mb">λ¨μ΄ μμ£Όλ‘ λ¬Έμ κ° μ μλ©λλ€.</Description>
        <Subtitle>π₯ HARD λͺ¨λ</Subtitle>
        <Description>νμ©μ¬κ° λ€μ΄κ° λ¬Έμ κ° μ μλ©λλ€.</Description>
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
