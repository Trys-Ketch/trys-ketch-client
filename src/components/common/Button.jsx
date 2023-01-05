import * as React from 'react';
import styled, { css } from 'styled-components';

const ButtonBlock = styled.button`
  width: ${(props) => props.width};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  cursor: pointer;
  outline: none;
  border: none;
  color: white;
  background: ${(props) => props.bgcolor || 'blue'};
  color: ${(props) => props.color || 'white'};
  &:active {
    background: ${(props) => props.bgcolor || 'blue'};
  }
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;
  ${(props) =>
    props.inline &&
    css`
      & + & {
        margin-left: 0.5rem;
      }
    `}
  ${(props) =>
    props.size === 'medium' &&
    css`
      height: 2rem;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
      font-size: 1rem;
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      height: 2.5rem;
      padding-left: 1.125rem;
      padding-right: 1.125rem;
      & + & {
        margin-left: 0.875rem;
      }
      font-size: 1.125rem;
    `}

  &:disabled {
    cursor: not-allowed;
    background: 'white';
    color: 'gray';
  }
`;

function Button({
  children,
  ref,
  bgcolor,
  color,
  inline,
  size = 'medium',
  width = 'auto',
  responsive = false,
  outlined = false,
  ...rest
}) {
  const htmlProps = rest;
  return (
    <ButtonBlock
      bgcolor={bgcolor}
      color={color}
      inline={inline}
      width={width}
      size={size}
      responsive={responsive}
      outlined={outlined}
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

export default Button;
