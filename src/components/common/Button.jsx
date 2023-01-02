import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Button({ label, backgroundColor = 'red', size = 'md', handleClick }) {
  return <StButton onClick={handleClick}>{label}</StButton>;
}

Button.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  handleClick: PropTypes.func,
};

const StButton = styled.button`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: none;
  padding: ${({ size }) => {
    let scale = 1;
    if (size === 'sm') scale = 0.75;
    if (size === 'lg') scale = 1.5;
    return `${scale * 0.5}rem ${scale * 1}rem`;
  }};
`;

export default Button;
