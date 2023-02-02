import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMuteUsers } from '../app/slices/muteSlice';

function useMuteUser(attendees, muteUser) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (attendees.length > muteUser.length) {
      const newMuteUser = [];
      for (let i = muteUser.length; i < attendees.length; i += 1) {
        newMuteUser.push({
          nickname: attendees[i].nickname,
          socketID: attendees[i].socketId,
          isMuted: false,
        });
      }
      dispatch(setMuteUsers([...muteUser, ...newMuteUser]));
    } else {
      const newMuteUsers = [];
      for (let i = 0; i < attendees.length; i += 1) {
        for (let j = 0; j < muteUser.length; j += 1) {
          if (attendees[i].socketId === muteUser[j].socketID) {
            newMuteUsers.push(muteUser[j]);
            break;
          }
        }
      }
      dispatch(setMuteUsers([...newMuteUsers]));
    }
  }, [attendees]);
}

export default useMuteUser;
