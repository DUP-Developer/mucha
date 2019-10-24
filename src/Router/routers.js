import Dashboard from '../Views/Pages/Dashboard'
import Login from '../Views/Login'
import Users from '../Views/Users'
import Items from '../Views/Items'
import * as Constants from '../Utils/Constants'
import Devices from '../Views/Pages/Devices'
import DevicesRegister from '../Views/Pages/Devices/Register'
import Profile from '../Views/Pages/Profile'
import DevicesEdit from '../Views/Pages/Devices/edit'
import ReportsDetail from '../Views/Pages/Report/Detail'
import Reports from '../Views/Pages/Report'

export default [
  {
    path: '/',
    component: Dashboard,
    rule: 'anonymous|admin|engineer',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/login',
    component: Login,
    rule: 'anonymous|admin',
    type: Constants.ROUTES_TYPES.PUBLIC
  },
  {
    path: '/users',
    component: Users,
    rule: 'admin',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/items',
    component: Items,
    rule: 'admin',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/devices',
    component: Devices,
    rule: 'admin',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/devices/register',
    component: DevicesRegister,
    rule: 'admin',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/profile',
    component: Profile,
    rule: 'admin|engineer',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/devices/edit/:id',
    component: DevicesEdit,
    rule: 'admin',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/reports',
    component: Reports,
    rule: 'admin|engineer',
    type: Constants.ROUTES_TYPES.PRIVATE
  },
  {
    path: '/reports/detail/:id',
    component: ReportsDetail,
    rule: 'admin|engineer',
    type: Constants.ROUTES_TYPES.PRIVATE
  }
]
