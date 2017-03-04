import axios from 'axios'

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

  repos() {
    return this.instance.get('/user/repos')
      .then(this._getData)
  }
}
