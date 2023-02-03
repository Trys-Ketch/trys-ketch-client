import { useEffect } from 'react';

function useEventSource(url, setRooms) {
  useEffect(() => {
    const evtSource = new EventSource(url);

    const connectEvent = (event) => {
      const data = JSON.parse(event.data);
      setRooms(data);
    };

    const changeEvent = (event) => {
      const data = JSON.parse(event.data);
      setRooms(data);
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
  }, []);
}

export default useEventSource;
