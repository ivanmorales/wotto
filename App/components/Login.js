import React,{Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  InputField,
  TouchableOpacity
} from 'react-native'

export default class Login extends Component {
  state = {

  }

  constructor(props){
  	super(props)
  }

  login() {
    if (this.props.loading)
      return
    this.props.login()
  }

  render() {
    const {
      error,
      loading,
    } = this.props

    return (
      <View>
        {loading && <Text>Logging you in</Text>}
        {error && <Text>There's an error</Text>}
        <TouchableOpacity
          onPress={this.login.bind(this)}>
          <Text>Login in with GitHub</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
