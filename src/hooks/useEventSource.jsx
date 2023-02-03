import { useEffect } from 'react';

function useEventSource(url, setRooms) {
  useEffect(() => {
    const evtSource = new EventSource(url);

    const connectEvent = (event) => {
      console.log('open');
      const data = JSON.parse(event.data);
      console.log(data);
      setRooms(data);
    };

    const changeEvent = (event) => {
      console.log('change');
      const data = JSON.parse(event.data);
      console.log(data);
      setRooms(data);
    };

    evtSource.onopen = () => {
      // 연결됐을때 방 정보 받아오기
      evtSource.addEventListener('connect', connectEvent);
      // 방 정보가 변할 때 방 정보 받아오기
      evtSource.addEventListener('changeRoom', changeEvent);
    };
    evtSource.onmessage = (event) => {
      console.log(event);
    };
    evtSource.onerror = (e) => {
      console.log('error:', e);
      console.log('error:', evtSource);
      evtSource.removeEventListener('connect', connectEvent);
      evtSource.removeEventListener('changeRoom', changeEvent);
    };

    return () => {
      evtSource.removeEventListener('connect', connectEvent);
      evtSource.removeEventListener('changeRoom', changeEvent);
      console.log('Event Source is closed');
      evtSource.close();
      console.log(evtSource);
    };
  }, []);
}

export default useEventSource;
