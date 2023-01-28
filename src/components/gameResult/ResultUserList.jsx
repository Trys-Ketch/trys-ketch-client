import React from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import ResultUser from './ResultUser';
import EmptyResultUser from './EmptyResultUser';

function ResultUserList({ userList }) {
  return (
    <UserArea>
      {userList.map((user) => (
        <ResultUser key={nanoid()} user={user} />
      ))}
      {[...Array(parseInt(8 - userList.length, 10))].map((_) => {
        return <EmptyResultUser key={nanoid()} />;
      })}
    </UserArea>
  );
}

const UserArea = styled.div`
  width: 36.2%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
`;

export default ResultUserList;
