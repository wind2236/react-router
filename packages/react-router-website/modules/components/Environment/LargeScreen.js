import React, { Component, PropTypes } from 'react'
import { Block, Row, Inline, Col } from 'jsxstyle'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import MarkdownViewer from './MarkdownViewer'
import SourceViewer from './SourceViewer'
import { Motion, spring } from 'react-motion'
import { LIGHT_GRAY, RED } from '../../Theme'
import Logo from '../Logo'
import Bundle from '../Bundle'
import FakeBrowser from './FakeBrowser'
import Media from 'react-media'


const Tab = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <Block
      component={Link}
      props={{ to }}
      flex="1"
      textAlign="center"
      textTransform="uppercase"
      fontWeight="bold"
      fontSize="90%"
      padding="5px"
      background={match ? RED : 'white'}
      color={match ? 'white' : ''}
      {...rest}
    />
  )}/>
)

const Tabs = () => (
  <Row
    margin="10px"
    boxShadow="0px 1px 1px hsla(0, 0%, 0%, 0.15)"
  >
    <Tab
      to="/web"
      borderTopLeftRadius="3px"
      borderBottomLeftRadius="3px"
    >Web</Tab>
    <Tab
      to="/native"
      marginLeft="-1px"
    >Native</Tab>
    <Tab
      to="/core"
      marginLeft="-1px"
      borderTopRightRadius="3px"
      borderBottomRightRadius="3px"
    >Core</Tab>
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
    top: 0,
    syncingMotion: false,
    mounted: false
  }

  componentDidMount() {
    const top = window.scrollY
    this.setState({ top }, () => {
      const browserRestored = top !== 0
      if (!browserRestored) {
        this.scroll()
      }
      this.setState({
        mounted: true
      })
    })
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
    const { top, syncingMotion, mounted } = this.state
    const y = !mounted || syncingMotion ? top : spring(top)

    return (
      <Motion style={{ y }}>
        {s => (
          <ScrollY y={Math.round(s.y)}/>
        )}
      </Motion>
    )
  }
}

const Branding = () => (
  <Col alignItems="center" margin="20px">
    <Logo size={36} shadow={false}/>
    <Block
      marginTop="10px"
      flex="1"
      textTransform="uppercase"
      fontWeight="bold"
      fontSize="90%"
    >
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
  </Col>
)

const Title = (props) => (
  <Block
    textTransform="uppercase"
    fontWeight="bold"
    color={LIGHT_GRAY}
    marginTop="20px"
    {...props}
  />
)

const NavLinks = ({ data, environment }) => (
  <Block
    lineHeight="1.8"
    padding="10px"
  >
    <Title>Examples</Title>
    <Block paddingLeft="10px">
      {data.examples.map((item, i) => (
        <Block
          key={i}
          component={Link}
          hoverTextDecoration="underline"
          props={{
            to: `/${environment}/example/${item.slug}`
          }}
        >{item.label}</Block>
      ))}
    </Block>

    <Title>Guides</Title>
    <Block paddingLeft="10px">
      <Block>Quick Start</Block>
      <Block>Reporting Issues</Block>
      <Block>Data Loading</Block>
      <Block>Code Splitting</Block>
      <Block>Server Rendering</Block>
    </Block>


    <Title>API</Title>
    <Block paddingLeft="10px" fontFamily="Monaco, monospace">
      {data.api.map((item, i) => (
        <Block
          key={i}
          component={Link}
          hoverTextDecoration="underline"
          props={{
            to: `/${environment}/api/${item.title.slug}`
          }}
        >
          {item.title.text}
        </Block>
      ))}
    </Block>
  </Block>
)

const Nav = ({ data, environment }) => (
  <Block
    fontSize="13px"
    background="#f0f0f0"
    overflow="auto"
    position="fixed"
    height="100vh"
    left="0"
    top="0"
    bottom="0"
    width="250px"
  >
    <Branding/>
    <Tabs/>
    <NavLinks data={data} environment={environment}/>
  </Block>
)

const API = ({ match, location, data }) => {
  const { params: { mod, header: headerParam, environment } } = match
  const doc = mod && data.api.find(doc => mod === doc.title.slug)
  const header = doc && headerParam ? doc.headers.find(h => h.slug === headerParam) : null
  return (
    <Block
      className="api-doc-wrapper"
      fontSize="80%"
    >
      <Block className="api-doc">
        <ScrollToDoc doc={doc} header={header}/>
        {data.api.map((d, i) => (
          <MarkdownViewer key={i} html={d.markup}/>
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

const LoadExample = ({ example, children }) => (
  <Bundle load={example.load}>
    {(Example) => (
      <Bundle load={example.loadSource}>
        {(src) => Example && src ? (
          children({ Example, src })
        ) : <Block>Loading...</Block>}
      </Bundle>
    )}
  </Bundle>
)

class Example extends Component {
  componentDidMount() {
    this.preloadExamples()
  }

  preloadExamples() {
    const { data } = this.props
    data.examples.forEach((example) => {
      example.load(() => {})
      example.loadSource(() => {})
    })
  }

  render() {
    const { data, match: { params: { example: exampleParam, environment } } } = this.props
    const example = data.examples.find(e => e.slug === exampleParam)
    return example ? (
      <LoadExample example={example}>
        {({ Example, src }) => (
          <Media query="(min-width: 1170px)">
            {(largeScreen) => (
              <Block
                minHeight="100vh"
                background="rgb(45, 45, 45)"
                padding="40px"
              >
                <FakeBrowser
                  position={largeScreen ? 'fixed' : 'static'}
                  width={largeScreen ? '400px' : 'auto'}
                  height={largeScreen ? 'auto' : '80vh'}
                  left="290px"
                  top="40px"
                  bottom="40px"
                >
                  <Example/>
                </FakeBrowser>
                <SourceViewer
                  code={src}
                  fontSize="11px"
                  marginLeft={largeScreen ? '440px' : null}
                  marginTop={largeScreen ? null : '40px'}
                />
              </Block>
            )}
          </Media>
        )}
      </LoadExample>
    ) : (
      <Redirect to={`/${environment}/example/${data.examples[0].slug}`}/>
    )
  }
}


const Content = ({ data, match }) => (
  <Block marginLeft="250px">
    <Switch>
      <Route
        path={`${match.path}/api/:mod?/:header?`}
        render={(props) => (
          <API {...props} data={data}/>
        )}
      />
      <Route
        path={`${match.path}/example/:example`}
        render={(props) => (
          <Example {...props} data={data}/>
        )}
      />
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
