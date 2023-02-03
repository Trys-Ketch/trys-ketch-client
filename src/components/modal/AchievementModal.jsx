import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import Arrow from '../../assets/icons/right-arrow.svg';
import useModal from '../../hooks/useModal';

function AchievementModal({ badges }) {
  const { closeModal } = useModal();
  const [currentBadge, setCurrentBadge] = useState(0);

  const getImagePath = (code) => {
    return `${process.env.REACT_APP_IMG_URL}/${code}.svg`;
  };

  const prevBadge = () => {
    if (currentBadge > 0) {
      setCurrentBadge(currentBadge - 1);
    }
  };

  const nextBadge = () => {
    if (currentBadge < badges.length - 1) {
      setCurrentBadge(currentBadge + 1);
    }
  };

  return (
    <Modal title="축하합니다!" btnText="확인" onConfirm={closeModal}>
      <Row>
        {currentBadge > 0 && (
          <PrevButton onClick={prevBadge}>
            <img src={Arrow} alt="prev" />
          </PrevButton>
        )}
        <Badge src={getImagePath(badges[currentBadge])} alt="badge" />
        {currentBadge < badges.length - 1 && (
          <NextButton onClick={nextBadge}>
            <img src={Arrow} alt="next" />
          </NextButton>
        )}
      </Row>
      <Description>뱃지는 마이페이지에서 확인 가능합니다</Description>
    </Modal>
  );
}

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const PrevButton = styled.button`
  position: absolute;
  left: 0;
  & img {
    transform: rotate(180deg);
    width: 20px;
  }
`;

const Badge = styled.img`
  width: 150px;
  height: 150px;
`;

const NextButton = styled.button`
  position: absolute;
  right: 0;
  & img {
    width: 20px;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

export default AchievementModal;
