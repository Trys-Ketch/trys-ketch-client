import React from 'react';
import styled from 'styled-components';
import Attendee from './Attendee';
import EmptyAttendee from './EmptyAttendee';

function AttendeeList({ userList }) {
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
