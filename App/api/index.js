import axios from 'axios'
import doWhilst from 'async/doWhilst'
import _map from 'lodash/map'

import Cache from './cache'

const cache = new Cache()

class GitHubApiError extends Error {
  constructor() {
    super(arguments)
  }
}

let ApiInstance = null

export default class GitHubApi {
  constructor(config) {
    if (!config.token) {
      throw new GitHubApiError({
        code: 'NULL_TOKEN',
        message: 'Token cannot be empty',
      })
    }

    this.instance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${config.token}`
      },
    })

    this.instance.interceptors.response.use((response)=> {
      console.log(`[${response.status}] ${response.config.url}`);
      return response
    })
  }

  static instance({token}) {
    return ApiInstance || (ApiInstance = new GitHubApi({token}))
  }

  static saveAuth(auth) {
    return new Promise( (yup, nope) => {
      cache.setItem('creds', auth, { expires: 60 * 24 })
        .then(yup)
        .catch(nope)
    })
  }

  static login() {
    // If we already have an instance just return it
    if (ApiInstance) {
      return Promise.resolve(ApiInstance)
    }

    return new Promise( (yup, nope) => {
      cache.getItem('creds')
        .then( creds => {
          console.log('CREDS', creds);
          try {
            const api = GitHubApi.instance({
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

  _getData = response => response.data

  profile() {
    return this.cacheOutput('profile', () => {
      return this.instance.get('/user')
        .then(this._getData)
    }, { expires: 60 * 4 })
  }

  hasLink(links, type = 'next') {
    let theLink = links.split(',')
      .map( link => {
        const match = /^\<([^>]+)\>; rel="([^"]+)"$/ig.exec(link)
        if (!match)
          return {}

        return {
          url: match[1],
          link: match[2],
        }
      })
      .filter( item => {
        return item.link && item.link === type
      })

    if (theLink.length)
      return theLink[0]
    return null
  }

  makeRequest(path, args = { method: 'get' }) {
    return new Promise( (yup, nope) => {
      let links = null
      const data = []
      doWhilst(
        (callback) => {
          this.instance[args.method](path)
            .then( response => {
              links = response.headers.link
              data.push(...response.data)
              callback()
            })
        }, () => {
          const nextLink = links && this.hasLink(links)

          if (nextLink) {
            path = nextLink.url.replace('https://api.github.com', '')
          }
          // Change the path to the new URL for the next page
          return !!nextLink
        }, (err) => {
            if (err)
              return nope(err)

            yup({data})
        })
    })

    // return new Promise( (yup, nope) => {
    //   this.instance[args.method](path)
    //     .then( response => {
    //
    //       const link = response.headers.link && this.hasLink(response.headers.link)
    //       console.log(link);
    //       if (link) {
    //         this.makeRequest(link.url, args, yup)
    //       } else {
    //         callback()
    //       }
    //     })
    // })
  }

  repoMap(repo) {
    return {
      id: repo.id,
      language: repo.language,
      name: repo.name,
      owner: {
        login: repo.owner.login,
        id: repo.owner.id
      }
    }
  }

  cacheOutput(key, fetchItem, policy = {}) {
    function doFetch(yup, nope) {
      return fetchItem()
        .then( response => {
          cache.setItem(key, response, policy)
            .then(() => yup(response))
            // Handle any errors and just return the response
            .catch(() => yup(response))
        })
        .catch(nope)
    }

    return new Promise( (yup, nope) => {
      cache.getItem(key)
        .then(item => {
          if (item)
            return yup(item)
          doFetch(yup, nope)
        })
        .catch( () => {
          return doFetch(yup, nope)
        })
    })
  }

  repos() {
    return this.cacheOutput('repos', () => {
      return this.makeRequest('/user/repos')
        .then(this._getData)
        .then( repos => repos.map(this.repoMap))
    }, { expires: 60 })
  }
}
