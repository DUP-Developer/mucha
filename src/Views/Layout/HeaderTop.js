import React, { Component } from 'react'
import {
  Menu,
  Dropdown,
  Icon,
  Layout,
  Row,
  Col,
  Avatar,
  Button
} from 'antd'
import { withRouter, Link } from 'react-router-dom'
import Colors from '../../Utils/Themes/Colors'
import Auth from '../../Utils/Auth'
import I18n from '../../i18n'

const { Header } = Layout

class HeaderTop extends Component {
  state = {
    locale : 'pt-br'
  }

  componentDidMount (){
    this.setState({locale: Auth.getLocale() === 'pt-br' ? 'en' : 'pt-br'})
  }

  logout = () => {
    localStorage.clear()

    this.props.history.push("/login")
  }

  onClick = () => {
    Auth.setLocale(this.state.locale)
    this.setState({locale : Auth.getLocale() === 'pt-br' ? 'en' : 'pt-br'})
  }

  menu = () => {
    return (
      <Menu style={{ margin: "10px 7% auto auto" }} >
        <Menu.Item key='0'>
          <Link to="/profile">
            {I18n.t('user.dropdownHeaderTop.profile')}
          </Link>
        </Menu.Item>
        <Menu.Item key='1' onClick={ this.logout }>
          {I18n.t('user.dropdownHeaderTop.exit')}
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <Header style={{ background: Colors.WHITE, padding: 0 }}>
        <Row type={'flex'} justify={'space-between'}>
          <Col>
            <Icon
              className='trigger'
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.props.toggleCollapsed}
            />
          </Col>
          <Col>
            <Button 
              type="default" 
              size="small" 
              style={{ margin: "auto 10px auto auto", width:50}}
              onClick = {() => this.onClick()}
              href = {`${window.location.pathname}`}
              > 
                <Icon type='global'/>
                {this.state.locale === 'pt-br'? 'pt' : this.state.locale}
              </Button>
            <Dropdown overlay={this.menu}>
              <span className='ant-dropdown-link' style={{color: Colors.DARK_BLUE}}>
                <span style={{ fontWeight: 800 }}> {Auth.getUser().name.toLocaleUpperCase()} </span>
                <Avatar style={{ backgroundColor: Colors.DARK_BLUE, margin: "auto 10px auto 10px" }} icon='user' />
                <Icon type='down' style={{ margin: "auto 20px auto auto" }} />
              </span>
            </Dropdown>
          </Col>
        </Row>
      </Header>
    )
  }
}

export default withRouter(HeaderTop)
