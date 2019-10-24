import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import routers from './routers'
import Page404 from '../Views/Page404'
import * as ManageRules from '../Utils/ManageRules'
import Auth from '../Utils/Auth'
import * as Constants from '../Utils/Constants'
import App from '../Views/App'
import _ from 'lodash'

class PrivateRouter extends Component {
  _privateComponent () {
    const Component = this.props.component
    return <App content={<Component {...this.props} />} />
  }

  _redirectComponent () {
    return (
      <Redirect
        to={{ pathname: '/login', state: { from: this.props.location } }}
      />
    )
  }

  render () {
    return (
      <Route
        {...this.props}
        onLeave={data => console.log('OnLeave = ', data)}
        component={() =>
          Auth.getUser()._id ? this._privateComponent() : this._redirectComponent()
        }
      />
    )
  }
}

export default class extends Component {
  render () {
    return (
      <BrowserRouter forceRefresh={_.isEmpty(Auth.getUser())}>
        <Switch>
          {routers.map((router, i) => {
            if (Constants.ROUTES_TYPES.PUBLIC === router.type) {
              return (
                <Route
                  key={i}
                  path={router.path}
                  exact={true}
                  component={router.component}
                />
              )
            } else if (Constants.ROUTES_TYPES.PRIVATE === router.type) {
              if (ManageRules.isPermited(router.rule)) {
                return (
                  <PrivateRouter
                    key={i}
                    path={router.path}
                    exact={true}
                    component={router.component}
                  />
                )
              }
            }

            return false
          })}
          <Route path="*" component={Page404} />
        </Switch>
      </BrowserRouter>
    )
  }
}
