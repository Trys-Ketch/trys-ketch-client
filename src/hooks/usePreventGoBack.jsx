import { useEffect } from 'react';
import { toast } from '../components/toast/ToastProvider';

const usePreventGoBack = () => {
  const preventGoBack = () => {
    history.pushState(null, '', location.href);
    toast.info('뒤로 갈 수 없어요😅');
  };

  // 브라우저에 렌더링 시 한 번만 실행하는 코드
  useEffect(() => {
    (() => {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', preventGoBack);
    })();

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);
};

export default usePreventGoBack;
