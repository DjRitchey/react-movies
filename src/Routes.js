import React from 'react'
import { Switch, Router, Route } from "react-router-dom"
import createBrowserHistory from 'history/createBrowserHistory'

import MovieIndex from './Movie/Index/Index.js'
import MovieNew from './Movie/New/New.js'
import MovieEdit from './Movie/Edit/Edit.js'
import NotFound from './NotFound'

const history = createBrowserHistory()

const Routes = () =>
  <Router history={history}>
    <Switch>
      <Route exact path='/movies/:id/edit' component={MovieEdit} />
      <Route exact path='/movies' component={MovieIndex} />
      <Route exact path='/movies/new' component={MovieNew} />
    </Switch>
  </Router>

  export default Routes
