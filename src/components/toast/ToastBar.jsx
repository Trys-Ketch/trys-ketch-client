import { motion } from 'framer-motion';
import React, { useEffect, memo } from 'react';
import styled from 'styled-components';
import { fadeInScale } from '../../helper/motions';

const toastDuration = 3000;

function ToastBar({ id, type, icon, message, onRemove }) {
  useEffect(() => {
    const timeoutForRemove = setTimeout(() => {
      onRemove(id);
    }, toastDuration);

    return () => {
      clearTimeout(timeoutForRemove);
    };
  }, [id, onRemove]);

  return (
    <StToast
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onRemove(id)}
      className={type}
    >
      <img src={icon} alt={type} />
      <Message>{message}</Message>
    </StToast>
  );
}

const StToast = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 350px;
  padding: 15px;
  border-radius: 10px;
  cursor: default;

  & img {
    width: 20px;
    height: 20px;
  }

  &.success {
    background-color: ${({ theme }) => theme.colors.DIM_GRAY};
  }

  &.info {
    background-color: ${({ theme }) => theme.colors.BLUE2};
  }

  &.error {
    background-color: ${({ theme }) => theme.colors.RED};
  }
`;

const Message = styled.div`
  margin-left: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.WHITE};
`;

export default memo(ToastBar);
