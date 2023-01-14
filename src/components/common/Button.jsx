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
  background: ${(props) => props.bgcolor || props.theme.colors.FLORAL_WHITE};
  color: ${(props) => props.color || props.theme.colors.DARK_LAVA};
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;
  transition: 0.2s ease;

  &:active {
    background: ${(props) => props.bgcolor || props.theme.colors.BONE2};
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
      font-size: ${({ theme }) => theme.fontSizes.md};
    `}

  ${(props) =>
    props.size === 'medium' &&
    css`
      height: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      font-size: ${({ theme }) => theme.fontSizes.lg};
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
      font-size: ${({ theme }) => theme.fontSizes.xl};
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
  responsive = false,
  outlined = false,
  disabled = false,
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
      disabled={disabled}
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
