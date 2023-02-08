import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../common/Modal';
import Range from '../common/Range';
import useModal from '../../hooks/useModal';
import speaker from '../../assets/icons/speaker-icon.svg';
import speakerMute from '../../assets/icons/speaker-mute-icon.svg';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';
import { setVolume } from '../../app/slices/soundSlice';

function SettingModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const sound = useSelector((state) => state.sound);
  const [range, setRange] = useState(sound.volume);

  const handleRange = (e) => {
    setRange(e.target.value);
  };

  const handleEnter = () => {
    GAEventTrack(GAEventTypes.Category.setting, GAEventTypes.Action.setting.Settings);
    closeModal();
  };

  useEffect(() => {
    dispatch(setVolume(range));
  }, [dispatch, range]);

  return (
    <Modal title="설정" btnText="완료" onConfirm={handleEnter}>
      <Row>
        <Typography>전체음량</Typography>
      </Row>
      <Row>
        <SoundButton>
          {range === '0' ? (
            <img src={speakerMute} alt="speaker-mute" />
          ) : (
            <img src={speaker} alt="speaker" />
          )}
        </SoundButton>
        <Range width="85%" min="0" max="1" step="0.01" value={range} onChange={handleRange} />
      </Row>
    </Modal>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SoundButton = styled.button`
  & img {
    width: 42px;
    height: 38px;
  }
`;

const Typography = styled.h3`
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.DIM_GRAY};
`;

export default SettingModal;
