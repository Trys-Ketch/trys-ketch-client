import React from 'react';
import styled from 'styled-components';
import DefaultProfile from '../../assets/icons/user.png';

function Avatar({ width, height }) {
  return (
    <CircleContainer width={width} height={height}>
      <img src={DefaultProfile} alt="profile" />
    </CircleContainer>
  );
}

const CircleContainer = styled.div`
  img {
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    object-fit: cover;
    border-radius: 50%;
  }
`;

export default Avatar;
