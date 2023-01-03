import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Button({ label, color, backgroundColor, size, handleClick }) {
  return (
    <StButton color={color} backgroundColor={backgroundColor} size={size} handleClick={handleClick}>
      {label}
    </StButton>
  );
}

Button.propTypes = {
  /** 버튼 내부 text */
  label: PropTypes.string,
  /** 버튼 글자 색 */
  color: PropTypes.string,
  /** 버튼 배경 색 */
  backgroundColor: PropTypes.string,
  /** 버튼 사이즈 small, medium, large */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** 버튼 click handler */
  handleClick: PropTypes.func,
};

Button.defaultProps = {
  label: 'press me',
  color: 'white',
  backgroundColor: 'red',
  size: 'md',
  handleClick: () => {},
};

const StButton = styled.button`
  color: ${({ color }) => color};
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
