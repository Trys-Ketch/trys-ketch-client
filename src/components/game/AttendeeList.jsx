import React from 'react';
import styled from 'styled-components';
import UserCard from '../user/UserCard';

const userList = [
  { id: 1, nickname: '영리한 붉은 박쥐' },
  { id: 2, nickname: '김화백' },
  { id: 3, nickname: '나는야피카소' },
];

function AttendeeList() {
  return (
    <GridList>
      {userList.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </GridList>
  );
}

const GridList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, auto));
`;

export default AttendeeList;
