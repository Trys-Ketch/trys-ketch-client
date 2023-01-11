import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import roomAPI from '../../api/room';

function Room({ id, title, cur, max, host }) {
  const navigate = useNavigate();

  const handleEnter = () => {
    roomAPI
      .enterRoom(id)
      .then((res) => {
        alert(res.data.message);
        if (res.data.statusCode === 200) {
          navigate(`/room/${id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <StRoom onClick={handleEnter}>
      <Title>{title}</Title>
      <Quota>{`${cur}/${max}`}</Quota>
      <Host>{host}</Host>
    </StRoom>
  );
}

const StRoom = styled.button`
  display: flex;
  justify-content: row;
  align-items: center;
  border: 1px solid;
  cursor: pointer;
`;

const Title = styled.h3``;

const Quota = styled.span``;

const Host = styled.span``;

export default Room;
