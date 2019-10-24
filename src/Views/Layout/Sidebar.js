import React from 'react'
import { Layout, Menu, Icon } from 'antd' // eslint-disable-line
import Images from '../../Utils/Images'
import Colors from '../../Utils/Themes/Colors'
import { version } from '../../../package.json'
import { Link } from 'react-router-dom' // eslint-disable-line
import Auth from '../../Utils/Auth'
import menuItems from './menu'
import { isPermited } from '../../Utils/ManageRules'

const { Sider } = Layout // eslint-disable-line

export default class extends React.Component {
  render () {
    return (
      <Sider
        trigger={null}
        collapsible
        style={{
          backgroundColor: Colors.BACKGROUND_SIDEBAR
        }}
        collapsed={this.props.collapsed}
      >
        {this.props.collapsed ? (
          <div className="logo">
            <img src={Images.teste} className={'logo-sidebar'} alt="" />
            <p style={{ color: 'white', textAlign: 'center' }}>v{version}</p>
          </div>
        ) : (
          <div className="logo">
            <img src={Images.logoWhite} className={'logo-sidebar'} alt="" />
            <p style={{ color: 'white', textAlign: 'center' }}>v{version}</p>
          </div>
        )}

        { !Auth.isFirstAccess() && 
          <Menu
            style={{
              backgroundColor: Colors.BACKGROUND_SIDEBAR,
              color: 'white'
            }}
            defaultSelectedKeys={[this.props.path]}
            mode="inline"
          >
            { menuItems.map(menu => {
              if (isPermited(menu.rule)) {
                return (
                  <Menu.Item key={menu.path} className="bg-color-secundary">
                    <Link to={menu.path}>
                      <Icon type={menu.icon} />
                      <span>{menu.title}</span>
                    </Link>
                  </Menu.Item>
                )
              }
            })}
          </Menu>
        }
      </Sider>
    )
  }
}
