import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import arrow from '../../assets/icons/right-arrow.svg';
import exp1 from '../../assets/images/explain1.png';
import exp2 from '../../assets/images/explain2.png';
import exp3 from '../../assets/images/explain3.png';
import exp4 from '../../assets/images/explain4.png';

const imgArray = [exp1, exp2, exp3, exp4];

function HowToPlayModal() {
  const [nowImg, setNowImg] = useState(0);
  return (
    <Modal width="1200px" title="게임 설명" hasBtn={false}>
      <ImgBtnWrapper>
        {!(nowImg === 0) ? (
          <PrevNextButton onClick={() => setNowImg((prev) => prev - 1)}>
            <img
              style={{
                height: '50px',
                transform: 'scaleX(-1)',
                aspectRatio: 'auto',
              }}
              src={arrow}
              alt="prev"
            />
          </PrevNextButton>
        ) : (
          <EmptyDiv />
        )}
        <Img src={imgArray[nowImg]} />
        {!(nowImg === imgArray.length - 1) ? (
          <PrevNextButton onClick={() => setNowImg((prev) => prev + 1)}>
            <img style={{ height: '50px', aspectRatio: 'auto' }} src={arrow} alt="next" />
          </PrevNextButton>
        ) : (
          <EmptyDiv />
        )}
      </ImgBtnWrapper>
    </Modal>
  );
}

const EmptyDiv = styled.div`
  width: 26.31px;
`;

const PrevNextButton = styled.button`
  width: max-content;
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: #746b5f;
  cursor: pointer;
`;

const ImgBtnWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Img = styled.img`
  height: 600px;
  aspect-ratio: auto;
  margin: 0 auto;
`;

export default HowToPlayModal;
