import React, { Component } from 'react'
import { Modal, Icon, Tree } from 'antd'
import I18n from '../../../../i18n'
import Services from '../../../../Services'
import openNotification from '../../../../Utils/OpenNotification'
import MapNavigationTemp from '../../../../Utils/MapNavigationTemp'

const { TreeNode } = Tree

export default class generateTree extends Component {
  state = {
    expandedKeys: ['Telas'],
    autoExpandParent: true,
    checkedKeys: ['Telas']
  }

  handleDiff = (arr1, arr2) => {
    return arr1.filter(item => !arr2.includes(item))
  }

  handleUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  getChildrenKeys = (children, data = []) => {
    children.forEach(item => {
      if (item.props.children) {
        data.push(item.key)
        return this.getChildrenKeys(item.props.children, data)
      }
    })

    return data
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  /**
   * Quando um nó da árvore , é marcado disparo a função abaixo que
   * retorna um array com valores distintos contendo as
   * chaves da árvore mudando assim o estado da aplicação
   */
  onCheck = (checkedKeys, details) => {
    const props = details.node.props

    if (props.checked) {
      checkedKeys = props.children
        ? this.handleDiff(
            this.state.checkedKeys,
            this.getChildrenKeys(props.children, [props.eventKey])
          )
        : [...this.state.checkedKeys, props.eventKey, ...props.parents].filter(
            this.handleUnique
          )
    } else {
      checkedKeys = [
        props.eventKey,
        ...this.state.checkedKeys,
        ...props.parents
      ].filter(this.handleUnique)
    }

    this.setState({ checkedKeys })
  }

  /**
   * Função recursiva utilizada para
   * renderizar o mapa de navegação
   * baseado em um json já definido
   */
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode {...item}>{this.renderTreeNodes(item.children)}</TreeNode>
        )
      }
      return <TreeNode {...item} />
    })
  }

  saveTree = async () => {
    const { generateTree, dataSource, hideModal } = this.props
    const tree = generateTree(dataSource, this.state.checkedKeys)
    const result = await Services.MapNavigation.getRoot({ ...tree[0] })

    const mapNavigation = await Services.MapNavigation.getMapNavigation(
      result.data._id
    )

    if (result) {
      MapNavigationTemp.set(result.data._id)
      openNotification('success',  I18n.t(result.status.message))
    }

    hideModal('generateTree')
    this.props.getRoot(mapNavigation)
    this.props.blockingScreen(true)
  }

  render() {
    const { visible, title, hideModal, loading, dataSource } = this.props

    return (
      <Modal
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={() => hideModal('generateTree')}
        onOk={this.saveTree}
        confirmLoading={loading}
        width={800}
        className="generate-tree"
      >
        <Tree
          switcherIcon={<Icon type="down" />}
          checkable
          checkStrictly
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          selectable={false}
          checkedKeys={this.state.checkedKeys}
          expandedKeys={this.state.expandedKeys}
        >
          <TreeNode title={'Telas'} key="Telas" disabled>
            {this.renderTreeNodes(dataSource[0] ? dataSource[0].children : [])}
          </TreeNode>
        </Tree>
      </Modal>
    )
  }
}
