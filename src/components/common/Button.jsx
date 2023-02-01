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
  border-bottom: 5px solid ${(props) => props.shadow || props.theme.colors.DIM_GRAY};
  background: ${(props) => props.bgcolor || props.theme.colors.FLORAL_WHITE};
  color: ${(props) => props.txtcolor || props.theme.colors.DARK_LAVA};
  border-radius: 10px;
  padding-top: 0;
  padding-bottom: 0;
  transition: 0.2s ease;

  &:not(:disabled):active {
    background: ${(props) => props.bgcolor || props.theme.colors.BONE2};
  }

  &:not(:disabled):hover {
    scale: 1.03;
  }

  ${(props) =>
    props.size === 'small' &&
    css`
      height: 3rem;
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
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.SHAMROK};
    border-bottom: 5px solid ${({ theme }) => theme.colors.RUSSIAN_GREEN};
    color: #ffffff80;
  }
`;

function Button({
  children,
  ref,
  txtcolor,
  bgcolor,
  shadow,
  size = 'medium',
  width = 'auto',
  ...rest
}) {
  const htmlProps = rest;
  return (
    <ButtonBlock
      txtcolor={txtcolor}
      bgcolor={bgcolor}
      shadow={shadow}
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
