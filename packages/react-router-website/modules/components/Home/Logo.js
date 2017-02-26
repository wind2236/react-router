import React from 'react'
import { Block, Row } from 'jsxstyle'
import { DARK_GRAY } from '../../Theme'
import LogoImage from '../../logo.png'

const Logo = ({ size = '230px' }) => (
  <Row
    background={DARK_GRAY}
    width={size}
    height={size}
    alignItems="center"
    borderRadius="50%"
    boxShadow="2px 10px 50px hsla(0, 0%, 0%, 0.35)"
  >
    <Block position="relative" top="-8px" textAlign="center" width="100%">
      <img src={LogoImage} width="75%"/>
    </Block>
  </Row>
)

export default Logo
