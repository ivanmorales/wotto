import axios from 'axios'
import doWhilst from 'async/doWhilst'

class GitHubApiError extends Error {
  constructor() {
    super(arguments)
  }
}

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
      }
    })
  }

  _getData = response => response.data

  profile() {
    return this.instance.get('/user')
      .then(this._getData)
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

  makeRequest(path, args = {
    method: 'get'
  }, callback) {
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

  repos() {
    return this.makeRequest('/user/repos')
      .then( r => {
        console.log(r);
        return r
      })
      .then(this._getData)
  }
}
