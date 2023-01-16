import * as React from 'react';
import styled, { css } from 'styled-components';

const ButtonBlock = styled.button`
  width: ${(props) => props.width};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'TTTogether';
  cursor: pointer;
  outline: none;
  border-bottom: 5px solid #746b5f;
  background: ${(props) => props.bgcolor || '#FFF8ED'};
  color: ${(props) => props.color || '#4E473F'};
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;
  transition: 0.2s ease;

  &:active {
    background: ${(props) => props.bgcolor || '#DFD8CD'};
  }

  &:hover {
    scale: 1.03;
  }

  ${(props) =>
    props.inline &&
    css`
      & + & {
        margin-left: 0.75rem;
      }
    `}

  ${(props) =>
    props.size === 'small' &&
    css`
      height: 3rem;
      padding-left: 2rem;
      padding-right: 2rem;
      font-size: 1rem;
    `}

  ${(props) =>
    props.size === 'medium' &&
    css`
      height: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      font-size: 1.125rem;
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      height: 5rem;
      padding-left: 1.125rem;
      padding-right: 1.125rem;
      & + & {
        margin-left: 0.875rem;
      }
      font-size: 1.25rem;
    `}

  &:disabled {
    cursor: not-allowed;
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
