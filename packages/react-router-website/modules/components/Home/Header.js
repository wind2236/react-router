import React from 'react'
import { Link } from 'react-router-dom'
import { Block, Row, Inline } from 'jsxstyle'
import { LIGHT_GRAY } from '../../Theme'
import Logo from './Logo'

const NavLink = ({ to, href, ...props }) => (
  <Block
    component={to ? Link : 'a'}
    props={{ to, href }}
    margin="0 10px"
    cursor="pointer"
    {...props}
  />
)

const Button = ({ to, ...props }) => (
  <Block
    component={Link}
    props={{ to }}
    padding="15px 25px"
    textTransform="uppercase"
    cursor="pointer"
    fontSize="10px"
    fontWeight="bold"
    userSelect="none"
    background="white"
    borderRadius="100px"
    boxShadow="0 10px 30px rgba(0, 0, 0, .25)"
    hoverBoxShadow="0 10px 25px rgba(0,0,0,.25)"
    activeBoxShadow="2px 2px 4px rgba(0,0,0,.25)"
    position="relative"
    top="0"
    hoverTop="1px"
    activeTop="5px"
    {...props}
  />
)

const NavBar = () => (
  <Row textTransform="uppercase" fontWeight="bold" width="100%">
    <Block flex="1" fontSize="14px">
      <Inline component="a" props={{ href:"https://reacttraining.com" }}>
        React Training
      </Inline>
      <Inline> / </Inline>
      <Inline
        component="a"
        props={{ href: 'https://github.com/ReactTraining/react-router' }}
        color={LIGHT_GRAY}
      >React Router</Inline>
    </Block>
    <Row fontSize="12px">
      <NavLink href="https://github.com/ReactTraining/react-router">GitHub</NavLink>
      <NavLink href="https://www.npmjs.com/package/react-router">NPM</NavLink>
      <NavLink href="https://reacttraining.com">Get Training</NavLink>
    </Row>
  </Row>
)

const Header = () => (
  <Block background="linear-gradient(125deg, #fff, #f3f3f3 41%, #ededed 0, #fff)">
    <Block padding="20px" maxWidth="1000px" margin="auto" >
      <NavBar/>
      <Block height="40px"/>
      <Row width="100%">
        <Block flex="1">
          <Logo />
        </Block>
        <Block flex="1">
          <Block lineHeight="1">
            <Block textTransform="uppercase" fontSize="20px" fontWeight="bold">
              Learn once, Route anywhere
            </Block>
            <Block component="h2" textTransform="uppercase" fontSize="350%" fontWeight="bold">
              React Router
            </Block>
          </Block>

          <Block margin="20px 0">
            Components are the heart of React's powerful, declarative
            programming model. React Router is a collection of <b>navigational
            components</b> that compose declaratively with your application. Whether
            you want to have <b>bookmarkable URLs</b> for your web app or a composable
            way to navigate in <b>React Native</b>, React Router works wherever React
            is rendering--so take your pick!
          </Block>

          <Row>
            <Button to="/web" marginRight="20px" flex="1" textAlign="center">Web</Button>
            <Button to="/native" marginRight="20px" flex="1" textAlign="center">Native</Button>
            <Button to="/core" marginRight="20px" flex="1" textAlign="center">Anywhere</Button>
          </Row>
        </Block>
      </Row>
      <Block height="20px"/>
    </Block>
  </Block>
)

export default Header
