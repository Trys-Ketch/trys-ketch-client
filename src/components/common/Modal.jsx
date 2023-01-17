import React from 'react';
import styled from 'styled-components';
import cancel from '../../assets/icons/cancel-icon.svg';
import FlatButton from './FlatButton';
import useModal from '../../hooks/useModal';

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const ModalWrap = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  width: 400px;
  padding: 20px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.ANTIQUE_WHITE};
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  cursor: pointer;
  img {
    color: ${({ theme }) => theme.colors.DAVYS_GRAY};
    width: 15px;
    height: 15px;
  }
`;

const Title = styled.h3`
  ${({ theme }) => theme.common.flexCenter};
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  font-family: 'TTTogether';
  width: 100%;
  margin-top: 15px;
`;

const ContentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Content = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  margin: 20px 0;
  & > *:not(:first-child) {
    margin-top: 15px;
  }
`;

const BtnArea = styled.div`
  width: 100%;
  button {
    width: 100%;
  }
`;

function Modal({ children, title, btnText, onConfirm }) {
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal();
  };

  return (
    <Overlay>
      <ModalWrap>
        <CloseButton onClick={handleClose}>
          <img src={cancel} alt="X" />
        </CloseButton>
        <ContentsWrap>
          <Title>{title}</Title>
          <Content>{children}</Content>
          <BtnArea>
            <FlatButton onClick={onConfirm}>{btnText}</FlatButton>
          </BtnArea>
        </ContentsWrap>
      </ModalWrap>
    </Overlay>
  );
}

export default Modal;
