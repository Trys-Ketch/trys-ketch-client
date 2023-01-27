/* src/RouteChangeTracker.js */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 구글 애널리틱스 운영서버만 적용
    if (process.env.REACT_APP_GOOGLE_ANALYSTICS_ID) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYSTICS_ID);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default RouteChangeTracker;
