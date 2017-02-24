import React from 'react'

// don't want the shimmed one
import BrowserRouter from '../../../react-router-dom/BrowserRouter'

// this stuff is shimmed, see ReactRouterDOMShim.js for more details
import { Switch, Route, Link } from 'react-router-dom'

import DelegateMarkdownLinks from './DelegateMarkdownLinks'
import Home from './Home'
import Environment from './Environment'

const App = () => (
  <BrowserRouter>
      <Switch>
        <Route path="/" render={({ match, location }) => console.debug(location.pathname) || (
          <div>
            <div><Link to="/one">One</Link></div>
            <Route path="/one" render={({ match, location }) => (
              <div>
                <div><Link to="/one/two">Two</Link></div>
                <Route path="/one/two" render={({ match, location }) => (
                  <div>
                    <div><Link to="/one/two/three">Three</Link></div>
                    <Route path="/one/two/three" render={({ match, location }) => (
                      <div>End</div>
                    )}/>
                  </div>
                )}/>
              </div>
            )}/>
          </div>
        )}/>
      </Switch>
  </BrowserRouter>
)

        //<Route path="/" exact={true} component={Home}/>
        //<Route path="/:environment" component={Environment}/>
export default App
