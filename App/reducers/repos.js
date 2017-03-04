import { combineReducers } from 'redux'
import { TYPES } from '@actions/repos'

const ReposInitialState = {
  error: null,
  loading: false,
  repos: []
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
        error: action.error.message || action.error,
      }
    default:
      return state
  }
}

export default repos
