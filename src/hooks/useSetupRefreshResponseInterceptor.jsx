import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupRefreshResponseInterceptor } from '../api/core/refresh';
import useModal from './useModal';

function useSetupRefreshResponseInterceptor() {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const setup = useCallback(
    () => setupRefreshResponseInterceptor(navigate, closeModal),
    [navigate, closeModal],
  );

  useEffect(() => {
    setup();
  }, []);
}

export default useSetupRefreshResponseInterceptor;
