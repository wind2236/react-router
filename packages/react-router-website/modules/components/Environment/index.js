import React, { Component } from 'react'
import LargeScreen from './LargeScreen'
import Bundle from '../Bundle'
import { Block } from 'jsxstyle'

const envData = {
  web: require('bundle?lazy!./data/Web'),
  native: require('bundle?lazy!./data/Native'),
  core: require('bundle?lazy!./data/Core')
}

class Environment extends Component {
  componentDidMount() {
    this.preload()
  }

  preload() {
    Object.keys(envData).forEach(key => envData[key](() => {}))
  }

  render() {
    const { match, match: { params: { environment }}} = this.props
    return (
      <Bundle load={envData[environment]}>
        {(data) => data ? (
          <LargeScreen data={data} match={match}/>
        ) : (
          <Block>Loading...</Block>
        )}
      </Bundle>
    )
  }
}

export default Environment

