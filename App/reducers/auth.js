import { TYPES } from '@actions/auth'

const initialState = {
  error: null,
  loading: false,
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.LOGIN_START:
      return {
        ...state,
        loading: action.loading
      }
    default:
      return state
  }
}

export default auth
