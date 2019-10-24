import React from 'react'
import { Anchor } from 'antd'
import * as Utils from '../../Utils'
const { Link } = Anchor // eslint-disable-line

export default class Summary extends React.Component {
  state = {
    expanded: []
  }

  treeNodes = data => {
    return data.map((item, it) => {
      this.state.expanded.push(Utils.transformNameId(item.label))

      if (item.children) {
        return (
          <Link
            key={it}
            href={`#${Utils.transformNameId(item.label)}`}
            title={`• ${item.label}`}
          >
            {this.treeNodes(item.children)}
          </Link>
        )
      }
      return (
        <Link
          key={it}
          href={`#${Utils.transformNameId(item.label)}`}
          title={`• ${item.label}`}
        />
      )
    })
  }

  handleClick = e => {
    e.preventDefault()
  }

  render() {
    return (
      <Anchor affix={false} onClick={this.handleClick}>
        {this.treeNodes(this.props.data)}
      </Anchor>
    )
  }
}
