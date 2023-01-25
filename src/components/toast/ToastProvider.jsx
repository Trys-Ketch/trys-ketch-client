import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import ToastBar from './ToastBar';
import Toaster from './core/Toaster';
import success from '../../assets/icons/check-toast-icon.svg';
import info from '../../assets/icons/info-toast-icon.svg';
import error from '../../assets/icons/cancel-toast-icon.svg';

const iconType = {
  success,
  info,
  error,
};

export let toast = new Toaster(null);

function ToastProvider() {
  const el = document.getElementById('toast');
  const [toastItems, setToastItems] = useState([]);

  const handleRemove = useCallback((toastId) => {
    return toast.removeToastItem(toastId);
  }, []);

  useEffect(() => {
    toast = new Toaster(setToastItems);
  }, []);

  return createPortal(
    <ToastWrapper>
      <AnimatePresence initial={false}>
        {toastItems.map((item) => (
          <ToastBar
            key={item.id}
            id={item.id}
            type={item.type}
            icon={iconType[item.type]}
            message={item.message}
            onRemove={handleRemove}
          />
        ))}
      </AnimatePresence>
    </ToastWrapper>,
    el,
  );
}

const ToastWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column-reverse;
  position: absolute;
  bottom: 3%;
  left: 50%;
  z-index: 1100;
  transform: translate(-50%, 0);

  & > *:not(:last-child) {
    margin-top: 5px;
  }
`;

export default ToastProvider;
