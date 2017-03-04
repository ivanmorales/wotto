import React from 'react'
import { Provider } from 'react-redux'
import store from '@store'

import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

import LoginContainer from '@containers/LoginContainer'

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

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Hi there</Text>
          <LoginContainer />
        </View>
      </Provider>
    )
  }
}
