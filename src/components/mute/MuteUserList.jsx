import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MuteUser from './MuteUser';

function MuteUserList({ socketID }) {
  const users = useSelector((state) => state.mute.users);
  // const users = [
  //   {
  //     nickname: '미안하다이거보여주려고어그로끌었다나루토사스케싸움수준ㄹㅇ실화냐',
  //     socketID: 'wq192v3r',
  //     isMuted: false,
  //   },
  //   { nickname: '네임2', socketID: '3eu1o29b', isMuted: true },
  // ];
  return (
    <div>
      {users.length !== 1 && (
        <UserList>
          {users.map((v) => {
            return socketID !== v.socketID && <MuteUser key={v.socketID} user={v} />;
          })}
        </UserList>
      )}
    </div>
  );
}

const UserList = styled.div`
  width: 200px;
  height: max-content;
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.FLORAL_WHITE};
`;

export default MuteUserList;
