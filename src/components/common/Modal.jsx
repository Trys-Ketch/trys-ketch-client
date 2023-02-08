import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import cancel from '../../assets/icons/cancel-icon.svg';
import FlatButton from './FlatButton';
import useModal from '../../hooks/useModal';

const scaleUp = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: 'easeIn',
      duration: 0.15,
    },
  },
};

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ModalWrap = styled(motion.div)`
  position: relative;
  width: ${(props) => props.width};
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

function Modal({ width = '400px', children, title, btnText, onConfirm, hasBtn = true }) {
  const overlayRef = useRef(null);
  const { closeModal } = useModal();

  const handleClose = () => {
    closeModal();
  };

  const handleClickOverlay = (e) => {
    if (overlayRef.current === e.target) {
      closeModal();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      ref={overlayRef}
      onClick={handleClickOverlay}
    >
      <ModalWrap initial="hidden" animate="visible" exit="exit" variants={scaleUp} width={width}>
        <CloseButton onClick={handleClose}>
          <img src={cancel} alt="X" />
        </CloseButton>
        <ContentsWrap>
          <Title>{title}</Title>
          <Content onKeyPress={handleKeyPress}>{children}</Content>
          {hasBtn && (
            <BtnArea>
              <FlatButton onClick={onConfirm}>{btnText}</FlatButton>
            </BtnArea>
          )}
        </ContentsWrap>
      </ModalWrap>
    </Overlay>
  );
}

export default Modal;
