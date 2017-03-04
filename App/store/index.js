import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import RootReducer from '@reducers'

const logger = createLogger({
  collapsed: true,
})

const initialState = {}

const store = createStore(RootReducer, initialState, applyMiddleware(thunk, logger))

export default store
