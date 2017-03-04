import OAuthManager from 'react-native-oauth'
import { NativeModules } from 'react-native'
const mmm = NativeModules.OAuthManager

console.log(mmm);

const manager = new OAuthManager('wotto')
manager.configure({
  github: {
    client_id: 'fe78800c329a9d30bea4',
    client_secret: 'e291bfedc9c5ea26b11661d7adac4758aaa9537f',
  }
})

export const TYPES = {
  LOGIN_START: 'login/start'
}

/* CONFIG
{
    apiKey: "AIzaSyCWUnvLfIdjuvE2Tm2RHKQ5B8wRTaJwJqc",
    authDomain: "wotto-d60a1.firebaseapp.com",
    databaseURL: "https://wotto-d60a1.firebaseio.com",
    storageBucket: "wotto-d60a1.appspot.com",
    messagingSenderId: "776062576773"
  }
*/

function loginStart() {
  return {
    type: TYPES.LOGIN_START,
    loading: true,
  }
}

export const login = () => {
  return (dispatch) => {
    dispatch(loginStart())

    return manager.authorize('github', {scopes: 'repo'})
      .then( response => {
        console.log(response);
        dispatch(loginStart())
      })
      .catch( err => {
        console.log(err);
        dispatch(loginStart())
      })
  }
}
