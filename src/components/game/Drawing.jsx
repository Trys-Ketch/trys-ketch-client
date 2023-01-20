import React, { useRef } from 'react';
import styled from 'styled-components';
import IconButton from '../common/IconButton';
import Container from '../layout/Container';
import Paint from '../painting/Paint';
import undo from '../../assets/icons/undo-icon.svg';
import redo from '../../assets/icons/redo-icon.svg';
import FloatBox from '../layout/FloatBox';
import SettingButton from '../button/SettingButton';
import MikeButton from '../button/MikeButton';

function Drawing({ submitImg, keyword }) {
  const undoRef = useRef(null);
  const redoRef = useRef(null);

  return (
    <>
      <FloatBox
        top={
          <>
            <SettingButton />
            <MikeButton />
          </>
        }
      />
      <Container style={{ paddingLeft: '0px', height: '680px', width: '1200px' }}>
        <LeftDiv>
          <IconButtonContainer>
            <IconButton onClick={() => undoRef.current()} size="xlarge" icon={undo} />
            <IconButton
              onClick={() => redoRef.current()}
              style={{ marginTop: '15px', marginBottom: '10px' }}
              size="xlarge"
              icon={redo}
            />
          </IconButtonContainer>
        </LeftDiv>
        <Paint keyword={keyword} undoRef={undoRef} redoRef={redoRef} submitImg={submitImg} />
      </Container>
    </>
  );
}
const IconButtonContainer = styled.div`
  position: absolute;
  transform: translate(-50%, 0);
  bottom: 0;
  left: 50%;
`;

const LeftDiv = styled.div`
  position: relative;
  height: 100%;
  width: 10%;
`;

export default Drawing;
