import { AsyncStorage } from 'react-native'

const defaultOptions = {
  namespace: 'cache',
  backend: AsyncStorage,
  policy: { expires: 60 }
}

export default class Cache {
  constructor(options = defaultOptions) {
    this.namespace = options.namespace
    this.backend = options.backend
    this.policy = options.policy
  }

  getKey(key) {
    return `${this.namespace}:${key}`
  }

  serialize(obj) {
    return JSON.stringify(obj)
  }

  deserialize(string) {
    return JSON.parse(string)
  }

  isExpired(object) {
    // if it's expired return null
    if (!object || object.expires < Date.now())
      return null
    // otherwise return payload
    return object.payload
  }

  composeItem(item, policy) {
    return {
      expires: Date.now() + (policy.expires * 60 * 1000),
      payload: item,
    }
  }

  getItem(key) {
    // Check if it exists
    return new Promise( (yup, nope) => {
      this.backend.getItem(this.getKey(key))
        .then(this.deserialize)
        .then(this.isExpired)
        .then(yup)
        .catch(nope)
    })
    // Check if it's expired
  }

  setItem(key, item, policy) {
    return new Promise( (yup, nope) => {
      // Compose item with policy
      item = this.composeItem(item, {
        ...this.policy,
        ...policy
      })

      // Store Item
      this.backend.setItem(this.getKey(key), this.serialize(item))
        .then(yup)
        .catch(nope)
    })
  }

  removeItem(key) {
    return new Promise( (yup, nope) => {
      this.backend.removeItem(this.getKey(key))
        .then(yup)
        .catch(nope)
    })
  }
}
