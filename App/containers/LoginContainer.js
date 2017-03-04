import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as actions from '@actions/auth'
import Login from '@components/Login'

const LoginContainer = (props) => {
  const {
    loading = false,
    error = null,
    login,
  } = props

  return (
    <Login
      loading={loading}
      error={error}
      login={login} />
  )
}

function mapStateToProps(state){
  return {
    error: state.auth.error,
    loading: state.auth.loading,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(LoginContainer)
