import React from 'react'
import LargeScreen from './LargeScreen'
import Bundle from '../Bundle'
import { Block } from 'jsxstyle'

const envData = {
  web: require('bundle?lazy!./WebData'),
  native: require('bundle?lazy!./NativeData'),
  core: require('bundle?lazy!./CoreData')
}

const Environment = ({ match: { params: { environment }}}) => (
  <Bundle load={envData[environment]}>
    {(data) => data ? (
      <LargeScreen data={data} environment={environment}/>
    ) : (
      <Block>Loading...</Block>
    )}
  </Bundle>
)

console.log('hi')

export default Environment

