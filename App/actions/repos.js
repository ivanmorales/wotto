import _keyBy from 'lodash/keyBy'

import GitHubApi from '@api'

export const TYPES = {
  REPOS_ERROR: 'repos/error',
  REPOS_START: 'repos/start',
  REPOS_SUCCESS: 'repos/success',
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

function _mapBy(path) {
  return results => {
    return results.reduce( (items, result) => {
      const key = _deepValue(result, path)
      if (!items[key]) {
        items[key] = []
      }
      items[key].push(result)
      return items
    }, {})
  }
}

function _deepValue(obj, path) {
    parts = path.split(".")
    if (parts.length==1){
        return obj[parts[0]]
    }
    return _deepValue(obj[parts[0]], parts.slice(1).join("."))
}

export const getRepos = () => {
  return (dispatch) => {
    dispatch(reposStart())
    GitHubApi.login()
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
