import OAuthManager from 'react-native-oauth'
import { AsyncStorage } from 'react-native'
import _keyBy from 'lodash/keyBy'

import GitHubApi from '@api'

const manager = new OAuthManager('wotto')
manager.configure({
  github: {
    client_id: 'fe78800c329a9d30bea4',
    client_secret: 'e291bfedc9c5ea26b11661d7adac4758aaa9537f',
  }
})

export const TYPES = {
  LOGIN_ERROR: 'login/error',
  LOGIN_START: 'login/start',
  LOGIN_SUCCESS: 'login/success',

  PROFILE_ERROR: 'profile/error',
  PROFILE_START: 'profile/start',
  PROFILE_SUCCESS: 'profile/success',

  REPOS_ERROR: 'repos/error',
  REPOS_START: 'repos/start',
  REPOS_SUCCESS: 'repos/success',
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

function loginSuccess() {
  return {
    type: TYPES.LOGIN_SUCCESS,
    loggedIn: true,
  }
}

function loginError(error) {
  return {
    type: TYPES.LOGIN_ERROR,
    error,
  }
}

function profileStart() {
  return {
    type: TYPES.PROFILE_START,
    loading: true,
  }
}

function profileSuccess(profile) {
  return {
    type: TYPES.PROFILE_SUCCESS,
    profile,
  }
}

function profileError(error) {
  return {
    type: TYPES.PROFILE_ERROR,
    error
  }
}


function reposStart() {
  return {
    type: TYPES.REPOS_START,
    loading: true,
  }
}

function reposSuccess(repos) {
  return {
    type: TYPES.REPOS_SUCCESS,
    repos,
  }
}

function reposError(error) {
  return {
    type: TYPES.REPOS_ERROR,
    error
  }
}

function login() {
  return new Promise( (yup, nope) => {
    AsyncStorage.getItem('creds')
      .then(JSON.parse)
      .then( creds => {
        let api = null

        try {
          const api = new GitHubApi({
            token: creds.accessToken,
          })

          yup(api)
        } catch (err) {
          nope(err)
        }
      })
      .catch(nope)
  })
}

function _mapBy(path) {
  return results => _keyBy(results, path)
}

export const getRepos = () => {
  return (dispatch) => {
    dispatch(reposStart())
    login()
      .then( api => {
        api.repos()
          .then(_mapBy('owner.login'))
          .then(reposSuccess)
          .catch(reposError)
          .then(dispatch)
      })
      .catch( err => dispatch(reposError(err)))
  }
}

export const getProfile = () => {
  return (dispatch) => {
    dispatch(profileStart())
    login()
      .then( api => {
        api.profile()
          .then(profileSuccess)
          .catch(profileError)
          .then(dispatch)
      })
      .catch(err => dispatch(profileError(err)))
  }
}

export const doLogin = () => {
  return (dispatch) => {
    dispatch(loginStart())

    return manager.authorize('github', {scopes: 'repo'})
      .then( res => {
        try {
          AsyncStorage.setItem('creds', JSON.stringify(res.response.credentials))
            .then(loginSuccess)
            .catch(loginError)
            .then(dispatch)
        } catch (err) {
          dispatch(loginError)
        }
      })
      .catch( err => dispatch(loginError(err)))
  }
}
