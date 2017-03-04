import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as actions from '@actions/auth'

import {
  ListView,
  Text,
  View,
  StyleSheet,
} from 'react-native'

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

class HomeContainer extends Component {
  constructor(props) {
    super(props)

    this.DataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      dataSource: this.DataSource.cloneWithRows([])
    }
  }

  componentDidMount() {
    this.props.getRepos()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.repos != this.props.repos) {
      this.setState({
        ...this.state,
        dataSource: this.DataSource.cloneWithRows(this.props.repos)
      })
    }
  }

  renderRow(row) {
    return (
      <View>
        <Text style={styles.instructions}>{row.owner.login}/</Text>
        <Text>{row.name}</Text>
      </View>
    )
  }

  render() {
    const {
      profile
    } = this.props

    return (
      <View style={styles.container}>
        <Text>Home Boy, {profile.name}</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    )
  }
}

function mapStateToProps(state){
  return {
    repos: state.auth.repos.repos,
    profile: state.auth.profile.profile,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(HomeContainer)
