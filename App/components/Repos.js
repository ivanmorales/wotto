import React from 'react'

import {
  GridRow,
  Image,
  Subtitle,
  Card,
  View,
  Screen,
  Button,
  Icon,
  Title,
  NavigationBar,
} from '@shoutem/ui'

class Repo extends React.Component {
  render() {
    const {
      owner
    } = this.props

    console.log(owner);

    return (
      <View>
        <Card>
          <Image
            styleName="medium-square"
            source={{url: owner.avatar }} />
          <View styleName="content">
            <Subtitle numberOfLines={2}>{owner.name}</Subtitle>
          </View>
        </Card>
      </View>
    )
  }
}

export default class Repos extends React.Component {
  render() {
    const {
      owners = null
    } = this.props

    return (
      <View>
        <View>
          <NavigationBar
            leftComponent={<Icon name="sidebar" />}
            centerComponent={<Title>Your Organizations</Title>}
          />
        </View>
        <View>
            {owners && Object.keys(owners).map( ownerKey => {
              return <Repo key={owners[ownerKey].id} owner={owners[ownerKey]} />
            })}
        </View>
      </View>
    )
  }
}
