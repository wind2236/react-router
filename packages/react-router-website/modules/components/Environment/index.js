import React from 'react'
import LargeScreen from './LargeScreen'
import Bundle from '../Bundle'
import { Block } from 'jsxstyle'

const envData = {
  web: require('bundle?lazy!./WebData'),
  native: require('bundle?lazy!./NativeData'),
  core: require('bundle?lazy!./CoreData')
}

const Environment = ({ match, match: { params: { environment }}}) => (
  <Bundle load={envData[environment]}>
    {(data) => data ? (
      <LargeScreen data={data} match={match}/>
    ) : (
      <Block>Loading...</Block>
    )}
  </Bundle>
)

export default Environment

