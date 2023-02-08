import * as React from 'react';
import styled, { css } from 'styled-components';

const ButtonBlock = styled.button`
  width: ${(props) => props.width};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard';
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  background: ${(props) => props.bgcolor || props.theme.colors.DIM_GRAY};
  color: ${(props) => props.color || props.theme.colors.WHITE};
  transition: 0.2s ease;
  &:active {
    /* background: ${(props) => props.bgcolor || '#DFD8CD'}; */
  }
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;

  ${(props) =>
    props.size === 'small' &&
    css`
      height: 3.5rem;
      padding-left: 2rem;
      padding-right: 2rem;
      font-size: ${({ theme }) => theme.fontSizes.lg};
    `}

  ${(props) =>
    props.size === 'medium' &&
    css`
      height: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      font-size: ${({ theme }) => theme.fontSizes.xl};
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      height: 5rem;
      padding-left: 1.125rem;
      padding-right: 1.125rem;
      font-size: ${({ theme }) => theme.fontSizes.xxl};
    `}

  &:disabled {
    opacity: 50%;
  }
`;

function FlatButton({ children, ref, bgcolor, color, size = 'medium', width = 'auto', ...rest }) {
  const htmlProps = rest;
  return (
    <ButtonBlock
      bgcolor={bgcolor}
      color={color}
      width={width}
      size={size}
      {...htmlProps}
      onClick={(e) => {
        if (htmlProps.onClick) {
          htmlProps.onClick(e);
        }
        e.target.blur();
      }}
    >
      {children}
    </ButtonBlock>
  );
}

export default FlatButton;
