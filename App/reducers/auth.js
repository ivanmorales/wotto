import { combineReducers } from 'redux'
import { TYPES } from '@actions/auth'

const LoginInitialState = {
  error: null,
  loading: false,
  loggedIn: false,
}

const ProfileInitialState = {
  error: null,
  loading: false,
  profile: null,
}

const ReposInitialState = {
  error: null,
  loading: false,
  repos: []
}

const profile = (state = ProfileInitialState, action) => {
  switch (action.type) {
    case TYPES.PROFILE_START:
      return {
        ...state,
        error: null,
        loading: true,
        profile: null,
      }
    case TYPES.PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        profile: action.profile,
      }
    case TYPES.PROFILE_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        profile: null,
      }
    default:
      return state
  }
}

const login = (state = LoginInitialState, action) => {
  switch (action.type) {
    case TYPES.LOGIN_START:
      return {
        ...state,
        error: null,
        loading: action.loading,
        loggedIn: false,
      }
    case TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        loggedIn: action.loggedIn,
      }
    case TYPES.LOGIN_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
        loggedIn: false,
      }
    default:
      return state
  }
}

const repos = (state = ReposInitialState, action) => {
  switch (action.type) {
    case TYPES.REPOS_START:
      return {
        ...state,
        loading: true,
      }
    case TYPES.REPOS_SUCCESS:
      return {
        ...state,
        loading: false,
        repos: action.repos,
      }
    case TYPES.REPOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }
    default:
      return state
  }
}

export default combineReducers({
  login,
  profile,
  repos,
})
