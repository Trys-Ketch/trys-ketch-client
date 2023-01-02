import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Example({ color }) {
  return <Container color={color}>Example</Container>;
}

Example.defaultProps = {
  color: 'black',
};

Example.propTypes = {
  /** 글자의 색을 지정하는 Props */
  color: PropTypes.string,
};

const Container = styled.p`
  width: 200px;
  color: ${({ color }) => color};
  font-size: 36px;
`;

export default Example;
