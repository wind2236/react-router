import React from 'react'

// don't want the shimmed one
import BrowserRouter from '../../../react-router-dom/BrowserRouter'

// this stuff is shimmed, see ReactRouterDOMShim.js for more details
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Environment from './Environment'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Home}/>
      <Route path="/:environment" component={Environment}/>
    </Switch>
  </BrowserRouter>
)

export default App
