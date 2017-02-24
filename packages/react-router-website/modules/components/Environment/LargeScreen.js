import React from 'react'
import { Block, Row } from 'jsxstyle'
import { Link } from 'react-router-dom'

const Nav = ({ data, environment }) => (
  <Block>
    {data.map((item, i) => (
      <Block
        key={i}
        component={Link}
        props={{
          to: `/${environment}/api/${item.title.slug}`
        }}
      >
        {item.title.text}
      </Block>
    ))}
  </Block>
)

const Content = () => null

const LargeScreen = ({ data, environment }) => (
  <Row height="100vh" overflow="hidden">
    <Nav data={data} environment={environment}/>
    <Content data={data}/>
  </Row>
)

export default LargeScreen
