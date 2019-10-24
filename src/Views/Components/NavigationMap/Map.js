import React, { Component } from 'react'
import { Tree, Icon } from 'antd'
import ListItem from './ListItem'
import NodeItems from './NodeItems'
import _ from 'lodash'

const { TreeNode } = Tree

class Map extends Component {
  treeNodes = (data, showModal) => {
    const updateTree = this.props.updateState
    
    return data.map(item => {
      if (item.children) {
        this.props.handleMapHash({ id: item._id, label: item.label })
        return (
          <TreeNode
          title={
            <ListItem
            data={item}
            showModal={showModal}
            updateTree={updateTree}
            />
          }
          key={item._id}
          >
            {this.treeNodes(item.children, showModal)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
        title={
          <ListItem
          data={item}
          showModal={showModal}
          teste={this.props.updateState}
          />
        }
        key={item._id}
        />
        )
      })
    }
    
    onSelect = (selectedKeys, details) => {
      this.props.onSelect(details.node.props.title.props.data)
    }

    verifySlectedScren = () => {
      if (this.props.selectedScreen){
        if (this.props.selectedScreen._id){
          return this.props.selectedScreen._id 
        }
        return this.props.selectedScreen
      }
      return this.props.data[0]._id
    }
    render() {
      const selectedScreen = this.verifySlectedScren()
      return (
        <>
        <Tree
          defaultExpandedKeys={[`${this.props.data[0]._id}`]}
          defaultSelectedKeys={[`${this.props.data[0]._id}`]}
          selectedKeys={[`${selectedScreen}`]}
          switcherIcon={<Icon type="down" />}
          onSelect={this.onSelect}
          >
          {this.treeNodes(this.props.data, this.props.showModal)}
        </Tree>
        <NodeItems
          data={_.isObject(this.props.selectedScreen) ?  this.props.selectedScreen : this.props.data[0]}
          showModal={this.props.showModal}
        />
      </>
    )
  }
}

export default Map
