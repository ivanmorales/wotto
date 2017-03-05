import _keyBy from 'lodash/keyBy'

import GitHubApi from '@api'

export const TYPES = {
  REPOS_ERROR: 'repos/error',
  REPOS_START: 'repos/start',
  REPOS_SUCCESS: 'repos/success',
  OWNER_FAVORITE: 'repos/favoriteOwner',
  OWNER_FAVORITE_REMOVE: 'repos/favoriteOwner/remove',
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

function mapRepos(repos) {
  return repos.reduce( (items, repo) => {
    const key = repo.owner.login
    // find owner object
    if (!items[key]) {
      // if it doesn't exist, create owner object
      items[key] = { ...repo.owner}
      items[key].repos = []
    }
    // add repo to owner's repos
    items[key].repos.push(repo)
    return items
  }, {})
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
          .then(mapRepos)
          .then(reposSuccess)
          .catch(reposError)
          .then(dispatch)
      })
      .catch( err => dispatch(reposError(err)))
  }
}

export const favoriteAdd = (ownerId) => {
  dispatch({
    type: TYPES.OWNER_FAVORITE,
    ownerId,
  })
}

export const favoriteRemove = (ownerId) => {
  dispatch({
    type: TYPES.OWNER_FAVORITE_REMOVE,
    ownerId,
  })
}
