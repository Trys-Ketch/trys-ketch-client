import * as React from 'react';
import styled, { css } from 'styled-components';

const ButtonBlock = styled.button`
  width: ${(props) => props.width};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard';
  font-weight: 700;
  cursor: pointer;
  outline: none;
  background: ${(props) => props.bgcolor || '#746b5f'};
  color: ${(props) => props.color || '#ffffff'};
  transition: 0.2s ease;
  &:active {
    /* background: ${(props) => props.bgcolor || '#DFD8CD'}; */
  }
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;

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
      font-size: 1rem;
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
      font-size: 1.125rem;
    `}

  &:disabled {
    cursor: not-allowed;
  }
`;

function FlatButton({
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

export default FlatButton;
