import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Avatar from '../common/Avatar';
import crown from '../../assets/icons/crown.png';
import check from '../../assets/icons/check-icon.svg';
import cancel from '../../assets/icons/cancel-icon.svg';
import useModal from '../../hooks/useModal';

function Attendee({ user }) {
  const { userId } = useSelector((state) => state.user);
  const { isHost } = useSelector((state) => state.ingame);
  const { socket } = useSelector((state) => state.ingame);
  const { id } = useParams();
  const { openModal } = useModal();

  const kick = () => {
    socket.send(JSON.stringify({ type: 'ingame/kick', room: id, kickId: user.socketId }));
  };

  const openKickModal = () => {
    openModal({ type: 'kick', props: { onKick: kick } });
    // ({ type: 'kick' });
  };

  return (
    <StUserCard className={user.userId === userId && 'mycard'}>
      <UserInfo>
        <Avatar src={user.imgUrl} width="35px" height="35px" />
        {user.isHost && <img className="host" src={crown} width="18px" height="18px" alt="host" />}
        <Nickname>{user.nickname}</Nickname>
      </UserInfo>
      {user.userId !== userId && (
        <HoverDisplay>
          {isHost && (
            <UserMore onClick={() => openKickModal()}>
              <img src={cancel} alt="kick" width="12px" height="12px" />
            </UserMore>
          )}
        </HoverDisplay>
      )}
      {user.isReady && !user.isHost && (
        <Ready>
          준비
          <img src={check} alt="check" />
        </Ready>
      )}
    </StUserCard>
  );
}

const UserInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: no-wrap;
`;

const Nickname = styled.span`
  margin-left: 10px;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1.5rem;
`;

// const UserActive = styled.div`
//   display: flex;
//   width: 80%;
//   position: absolute;
//   bottom: 10px;
//   left: 50%;
//   transform: translate(-50%, 0);
//   align-items: center;
// `;

const UserMore = styled.button`
  position: absolute;
  right: 12px;
  top: 10px;
`;

const HoverDisplay = styled.div`
  display: none;
  z-index: 300;
`;

const Ready = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.WHITE};
  background-color: ${({ theme }) => theme.colors.BLUE};
  padding: 4px;
  background-clip: content-box;
`;

const StUserCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  height: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
  padding: 20px;
  transition: 0.2 ease;
  &:hover ${HoverDisplay} {
    display: block;
  }
  &.mycard {
    box-shadow: inset 0 0 0 4px ${({ theme }) => theme.colors.BLUE2};
  }
  & img.host {
    position: absolute;
    top: 11px;
    left: 13px;
    transform: rotate(320deg);
  }
`;

export default Attendee;
