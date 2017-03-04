import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as actions from '@actions/auth'
import Login from '@components/Login'

import { Actions } from 'react-native-router-flux'

import { Text, View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class LoginContainer extends React.Component {
  componentDidMount() {
    this.props.getProfile()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.profile.profile && this.props.profile.profile) {
      return Actions.home()
    }

    if (!prevProps.login.loggedIn && this.props.login.loggedIn) {
      this.props.getProfile()
    }
  }

  render() {
    const {
      login,
      profile,
      doLogin,
    } = this.props

    return (
      <View style={styles.container}>
        {!profile.loading && !profile.profile && <Login loading={login.loading} error={login.error} login={doLogin} />}
        {profile.loading && <Text>Are you logged in already?</Text>}
      </View>
    )
  }
}

function mapStateToProps(state){
  return {
    login: state.auth.login,
    profile: state.auth.profile,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(LoginContainer)
