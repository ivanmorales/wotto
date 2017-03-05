import { createSelector } from 'reselect'

const ownersSelector = state => state.repos.repos
const favoritesSelector = state => state.repos.favorites

export default createSelector(
  ownersSelector,
  favoritesSelector,
  (owners, favorites) => {
    return Object.keys(owners)
      .filter( ownerKey => {
        return favorites.indexOf(owners[ownerKey].id) > -1
      })
      .map( key => owners[key] )
  }
)
