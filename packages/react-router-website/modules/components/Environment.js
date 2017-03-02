import React, { Component } from 'react'
import EnvironmentLarge from './EnvironmentLarge'
import Bundle from './Bundle'
import { Block } from 'jsxstyle'

const envData = {
  web: require('bundle?lazy!../docs/Web'),
  native: require('bundle?lazy!../docs/Native'),
  core: require('bundle?lazy!../docs/Core')
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
          <EnvironmentLarge data={data} match={match}/>
        ) : (
          <Block>Loading...</Block>
        )}
      </Bundle>
    )
  }
}

export default Environment

