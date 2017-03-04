import React from 'react'
import {
  Scene,
  Router,
} from 'react-native-router-flux'

import LoginContainer from '@containers/LoginContainer'
import HomeContainer from '@containers/HomeContainer'

export const Routes = props => {
  return (
    <Router>
      <Scene key="root" hideNavBar hideTabBar>
        <Scene key="login" component={LoginContainer} initial={true}/>
        <Scene key="home" component={HomeContainer} />
      </Scene>
    </Router>
  )
}
