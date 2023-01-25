import { motion } from 'framer-motion';
import React, { useEffect, memo } from 'react';
import styled from 'styled-components';

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
      className={type}
      onClick={() => onRemove(id)}
      positionTransition
      initial={{ opacity: 0, y: 30, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
