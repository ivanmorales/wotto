import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as actions from '@actions/repos'
import Repos from '@components/Repos'

class HomeContainer extends Component {

  componentDidMount() {
    this.props.getRepos()
  }

  render() {
    const {
      repos,
      favoriteAdd,
      favoriteRemove,
    } = this.props

    console.log('blah', repos);
    return (
      <Repos
        owners={repos}
        onSelect={favoriteAdd}
        onUnSelect={favoriteRemove} />
    )
  }
}

function mapStateToProps(state){
  return {
    repos: state.repos.repos,
    favorites: state.repos.favorites,
    profile: state.auth.profile.profile,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(actions, dispatch)
}

export default connect (mapStateToProps, mapDispatchToProps)(HomeContainer)
