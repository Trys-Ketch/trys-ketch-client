import React from 'react';
import styled from 'styled-components';
import Input from '../common/Input';
import Button from '../common/Button';

function CreateRoomModal({ setIsOpen }) {
  return (
    <ModalOverlay>
      <Modal>
        <Title>방 만들기</Title>
        <CloseBtn onClick={() => setIsOpen()}>X</CloseBtn>
        <Input />
        <Button width="100%">만들기</Button>
      </Modal>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  height: 500px;
  border-radius: 3px;
  background-color: #fff;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 500;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
`;

export default CreateRoomModal;
