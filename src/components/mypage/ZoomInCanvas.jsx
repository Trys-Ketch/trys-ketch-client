import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import downloadImage from '../../utils/downloadImage';
import download from '../../assets/icons/download-icon-white.svg';

function ZoomInCanvas({ selected, onClose }) {
  const [isHover, setIsHover] = useState(false);
  const overlayRef = useRef(null);

  const date = dayjs(selected.createdAt).format('YYYY-MM-DD');

  const handleClickOverlay = (e) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  const handleDownload = () => {
    downloadImage(selected.imgPath);
  };

  return (
    <ImageModalLayout layoutId={selected.imgId} ref={overlayRef} onClick={handleClickOverlay}>
      <Canvas onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <img src={selected.imgPath} alt="selected" />
        {isHover && (
          <AnimatePresence>
            <HoverBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Row>
                <DownloadButton onClick={handleDownload}>
                  <img src={download} alt="download" />
                </DownloadButton>
                <ImageInfo>
                  by {selected.painter}, {date}
                </ImageInfo>
              </Row>
            </HoverBox>
          </AnimatePresence>
        )}
      </Canvas>
    </ImageModalLayout>
  );
}

const DownloadButton = styled.button`
  img {
    width: 8px;
  }
`;

const ImageModalLayout = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.67);
  ${({ theme }) => theme.common.flexCenter};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const HoverBox = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0.75) 100%
  );
`;

const ImageInfo = styled.div`
  color: ${({ theme }) => theme.colors.WHITE};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Canvas = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.WHITE};
  width: 65%;
  aspect-ratio: 930 / 527;
  border-radius: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export default ZoomInCanvas;
