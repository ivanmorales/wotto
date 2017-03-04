/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { AppRegistry } from 'react-native';

import App from './App'

export default class wotto extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('wotto', () => wotto);
