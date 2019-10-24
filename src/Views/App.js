import React from 'react';
import '../Assets/css/App.css';
import {
  Layout,
} from 'antd';
import Sidebar from './Layout/Sidebar'
import Breadcrumb from './Layout/Breadcrumb'
import HeaderTop from './Layout/HeaderTop'
import Colors from '../Utils/Themes/Colors'

const {
  Content
} = Layout;

export default class extends React.Component {
  state = {
    collapsed: false
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar path={this.props.content.props.location.pathname} collapsed={this.state.collapsed} />
        <Layout>
          <HeaderTop
            collapsed={this.state.collapsed}
            toggleCollapsed={() => this.setState({ collapsed: !this.state.collapsed })}/>
          <Content style={{ padding: '0 16px', background: Colors.GREEN }}>
            <Breadcrumb path={ this.props.content.props.location.pathname }/>
            {this.props.content}
            {/* <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

            </div> */}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
