import React, { Component, PropTypes } from 'react'
import { Block, Row } from 'jsxstyle'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import MarkdownViewer from './MarkdownViewer'
import { Motion, spring } from 'react-motion'

const Tab = ({ to, ...rest }) => (
  <Block
    component={Link}
    props={{ to }}
    {...rest}
  />
)

const Tabs = () => (
  <Row>
    <Tab to="/web">Web</Tab>
    <Tab to="/native">Native</Tab>
    <Tab to="/core">Core</Tab>
  </Row>
)

class ScrollY extends Component {
  static propTypes = {
    y: PropTypes.number
  }

  componentDidMount() {
    this.scroll()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.y !== this.props.y)
      this.scroll()
  }

  scroll() {
    window.scrollTo(0, this.props.y)
  }

  render() {
    return null
  }
}

class ScrollToDoc extends Component {
  state = {
    top: window.scrollY,
    syncingMotion: false
  }

  componentDidMount() {
    this.scroll()
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.doc !== this.props.doc) ||
      (prevProps.header !== this.props.header)
    ) {
      this.scroll()
    }
  }

  scroll() {
    const { header, doc } = this.props
    const id = header ? (
      `${doc.title.slug}-${header.slug}`
    ) : (
      doc.title.slug
    )
    const el = document.getElementById(id)
    this.setState({
      top: window.scrollY,
      syncingMotion: true
    }, () => {
      this.setState({
        top: window.scrollY + el.getBoundingClientRect().top - 80,
        syncingMotion: false
      })
    })
  }

  render() {
    const { top, syncingMotion } = this.state
    const y = syncingMotion ? top : spring(top)

    return (
      <Motion style={{ y }}>
        {s => (
          <ScrollY y={Math.round(s.y)}/>
        )}
      </Motion>
    )
  }
}

const Nav = ({ data, environment }) => (
  <Block
    background="#f0f0f0"
    overflow="auto"
    position="fixed"
    height="100vh"
    left="0"
    top="0"
    bottom="0"
    width="250px"
    fontFamily="Monaco, monospace"
  >
    <Tabs/>
    {data.api.map((item, i) => (
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

const API = ({ match, data }) => {
  const { params: { mod, header: headerParam, environment } } = match
  const doc = mod && data.api.find(doc => mod === doc.title.slug)
  const header = doc && headerParam ? doc.headers.find(h => h.slug === headerParam) : null
  console.log(mod && !doc)
  return (
    <Block>
      <Block>
        <ScrollToDoc doc={doc} header={header}/>
        {data.api.map((d, i) => (
          <MarkdownViewer html={d.markup}/>
        ))}
      </Block>
      {mod && !doc && (
        <Redirect to={`/${environment}/api`}/>
      )}
      {headerParam && doc && !header && (
        <Redirect to={`/${environment}/api/${mod}`}/>
      )}
    </Block>
  )
}

const Example = () => (
  <Block>
    Example
  </Block>
)


const Content = ({ data, match }) => (
  <Block marginLeft="300px" padding="20px">
    <Switch>
      <Route path={`${match.path}/api/:mod?/:header?`} render={(props) => <API {...props} data={data}/>}/>
      <Route path={`${match.path}/examples/:example`} component={Example} data={data}/>
      <Redirect to={match.url}/>
    </Switch>
  </Block>
)

const LargeScreen = ({ data, match }) => (
  <Block>
    <Nav data={data} environment={match.params.environment}/>
    <Content data={data} match={match}/>
  </Block>
)

export default LargeScreen
