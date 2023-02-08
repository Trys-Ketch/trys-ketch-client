import { useEffect, useState } from 'react';

function useEventSource(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const evtSource = new EventSource(url);

    const connectEvent = (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    };

    const changeEvent = (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    };

    evtSource.onopen = () => {
      // 연결됐을때 방 정보 받아오기
      evtSource.addEventListener('connect', connectEvent);
      // 방 정보가 변할 때 방 정보 받아오기
      evtSource.addEventListener('changeRoom', changeEvent);
    };
    evtSource.onmessage = (event) => {
      // console.log(event);
    };
    evtSource.onerror = (e) => {
      evtSource.removeEventListener('connect', connectEvent);
      evtSource.removeEventListener('changeRoom', changeEvent);
    };

    return () => {
      evtSource.removeEventListener('connect', connectEvent);
      evtSource.removeEventListener('changeRoom', changeEvent);
      evtSource.close();
    };
  }, [url]);

  return { data };
}

export default useEventSource;
