import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import I18n from '../../i18n'
import * as Utils from '../../Utils'
export default class extends Component {
  render () {
    // pegando tudo que mão seja um objectId
    let route = this.props.path
      .split('/')
      .filter(pathRouter => {
        return !Utils.validateObjectId(pathRouter) && pathRouter !== ''
      })
      .map(data => (data === '' ? 'index' : data))

    return (
      <Breadcrumb style={{ margin: '16px 0' }}>
        {route.map((r, i) => {
          return (
            <Breadcrumb.Item
              key={`${i === 0 ? r : route.slice(0, i + 1).join('/')}`}
            >
              <a href={(route.length - 1) === i ? '' : `/${i === 0 ? r : route.slice(0, i + 1).join('/')}`}>
                {I18n.t(
                  `route.${
                    route.length
                      ? i === 0
                        ? route.slice(0, i + 1).join('.') + '.index'
                        : route.slice(0, i + 1).join('.')
                      : route.slice(0, i + 1).join('.')
                  }`
                )}
              </a>
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    )
  }
}
