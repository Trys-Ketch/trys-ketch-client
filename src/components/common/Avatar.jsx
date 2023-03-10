import React from 'react';
import styled from 'styled-components';
import DefaultProfile from '../../assets/icons/user.png';

function Avatar({ src, width, height }) {
  return (
    <CircleContainer width={width} height={height}>
      <img src={src || DefaultProfile} alt="profile" />
    </CircleContainer>
  );
}

const CircleContainer = styled.div`
  img {
    width: ${(props) => props.width || '48px'};
    height: ${(props) => props.height || '48px'};
    object-fit: cover;
    border-radius: 50%;
  }
`;

export default Avatar;
