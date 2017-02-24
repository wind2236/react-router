import React, { Component } from 'react'
import { Block, Row } from 'jsxstyle'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import MarkdownViewer from './MarkdownViewer'

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

class ScrollToDoc extends Component {
  componentDidMount() {
    this.scroll()
  }

  componentDidUpdate() {
    this.scroll()
  }

  scroll() {
    //console.log(this.props)
  }

  render() {
    return this.props.children
  }
}

const Nav = ({ data, environment }) => (
  <Block>

    <Tabs/>

    <Block
      component='a'
      className="internal-link"
      props={{
        href: `/web/api/BrowserRouter/basename-string`
      }}
    >
      GO!
    </Block>

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
  const doc = data.api.find(doc => mod === doc.title.slug)
  const header = doc && header ? doc.headers.find(h => h.slug === headerParam) : true
  //const validHeader = headerParam ? !!header : true
  console.log(header, match.url)
  return (
    <Block>
      {doc ? (
        header ? (
          <ScrollToDoc doc={doc} header={header}>
            <Block>
              {data.api.map((d, i) => (
                <MarkdownViewer
                  html={d.markup}
                  id={d.title.slug}
                />
              ))}
            </Block>
          </ScrollToDoc>
        ) : console.log('redirect 1') || (
          <Redirect to={`/${environment}/api/${mod}`}/>
        )
      ) : console.log('redirect 2') || (
        <Redirect to={`/${environment}/api`}/>
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
  <Block flex="1" overflow="auto">
    <Switch>
      <Route path={`${match.path}/api/:mod?/:header?`} render={(props) => <API {...props} data={data}/>}/>
      <Route path={`${match.path}/examples/:example`} component={Example} data={data}/>
      <Redirect to={match.url}/>
    </Switch>
  </Block>
)

const LargeScreen = ({ data, match }) => (
  <Row height="100vh" overflow="hidden">
    <Nav data={data} environment={match.params.environment}/>
    <Content data={data} match={match}/>
  </Row>
)

export default LargeScreen
