import { store } from '../app/configStore';
import authAPI from '../api/auth';
import { setCookie } from './cookie';

function requestNewToken() {
  const { member } = store.getState().login;
  if (member !== 'guest') {
    authAPI.askToken().then((response) => {
      setCookie(response.headers.authorization);
    });
  }
}

export default requestNewToken;
