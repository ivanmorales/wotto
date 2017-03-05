import { combineReducers } from 'redux'
import { TYPES } from '@actions/repos'
import _remove from 'lodash/remove'

const ReposInitialState = {
  error: null,
  loading: false,
  repos: [],
  favorites: [],
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
    case TYPES.OWNER_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.repoId]
      }
    case TYPES.OWNER_FAVORITE_REMOVE:
      return {
        ...state,
        favorites: _remove(state.favorites, action.repoId)
      }
    default:
      return state
  }
}

export default repos
