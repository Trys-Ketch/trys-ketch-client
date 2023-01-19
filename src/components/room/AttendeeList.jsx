import React from 'react';
import styled from 'styled-components';
import Attendee from './Attendee';
import EmptyAttendee from './EmptyAttendee';

const userList = [
  { userId: 'asdfasdfwe', nickname: '영리한 붉은 박쥐', isHost: true, isReady: true },
  { userId: 'asdf23r454', nickname: '김화백', isHost: false, isReady: false },
  { userId: 'cvsdfgwer4', nickname: '나는야피카소', isHost: false, isReady: true },
  { userId: 'sdfwergnuf', nickname: '보살핌이 필요한 친구', isHost: false, isReady: true },
];

function AttendeeList() {
  return (
    <GridList>
      {userList.map((user) => (
        <Attendee key={user.userId} user={user} />
      ))}
      {[...Array(parseInt(8 - userList.length, 10))].map((n) => (
        <EmptyAttendee key={n} />
      ))}
    </GridList>
  );
}

const GridList = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
`;

export default AttendeeList;
