import React from 'react';
import styled, { css } from 'styled-components';

const ButtonWrapper = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const ButtonBlock = styled.button`
  width: ${(props) => props.width};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'TTTogether';
  cursor: pointer;
  outline: none;
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  background: ${({ theme }) => theme.colors.FLORAL_WHITE};
  border: 2px solid ${({ theme }) => theme.colors.DIM_GRAY};
  border-bottom: 5px solid ${({ theme }) => theme.colors.DIM_GRAY};
  box-shadow: inset 0 0 0 3px ${({ theme }) => theme.colors.FLORAL_WHITE};
  border-radius: 10px;

  padding-top: 0;
  padding-bottom: 0;
  transition: 0.2s ease;

  ${(props) =>
    props.size === 'small' &&
    css`
      width: 2.5rem;
      height: 2.5rem;
      img {
        width: 22px;
        height: 22px;
      }
    `}

  ${(props) =>
    props.size === 'medium' &&
    css`
      width: 3rem;
      height: 3rem;
      img {
        width: 30px;
        height: 30px;
      }
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      width: 3.5rem;
      height: 3.5rem;
      img {
        width: 36px;
        height: 36px;
      }
    `}

    ${(props) =>
    props.size === 'xlarge' &&
    css`
      width: 4rem;
      height: 4rem;
      img {
        width: 42px;
        height: 42px;
      }
    `}

    ${(props) =>
    props.size === 'xxlarge' &&
    css`
      width: 4.5rem;
      height: 4.5rem;
      img {
        width: 48px;
        height: 48px;
      }
    `}

  &:active {
    background: ${({ theme }) => theme.colors.BONE2};
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ selected }) =>
    selected &&
    css`
      background: ${({ theme }) => theme.colors.BONE2};
    `}
`;

const Typography = styled.span`
  color: ${({ theme }) => theme.colors.DARK_LAVA};
  font-family: 'TTTogether';
  font-weight: ${({ theme }) => theme.fontWeight.regular};

  ${(props) =>
    props.size === 'small' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes.sm};
    `}

  ${(props) =>
    props.size === 'medium' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes.md};
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes.lg};
    `}

    ${(props) =>
    props.size === 'xlarge' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes.xl};
    `}

    ${(props) =>
    props.size === 'xxlarge' &&
    css`
      font-size: ${({ theme }) => theme.fontSizes.xxl};
    `}
`;

function IconButton({ icon, text, size = 'medium', selected, ...rest }) {
  const htmlProps = rest;
  return (
    <ButtonWrapper>
      <ButtonBlock
        size={size}
        selected={selected}
        {...htmlProps}
        onClick={(e) => {
          if (htmlProps.onClick) {
            htmlProps.onClick(e);
          }
          e.target.blur();
        }}
      >
        <img src={icon} alt="setting" />
      </ButtonBlock>
      {text && <Typography size={size}>{text}</Typography>}
    </ButtonWrapper>
  );
}

export default IconButton;
