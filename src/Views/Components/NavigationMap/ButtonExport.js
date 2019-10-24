import React from 'react'
import I18n from '../../../i18n'
import {Button} from 'antd'

const beforeDownload = (tree, data = []) => {
  tree.forEach(item => {
    data.push({
      label: item.label,
      title: item.label,
      description: item.description,
      children: [],
      items: [...item.items],
      key: '',
      parents: []
    })

    if (item.children) {
      beforeDownload(
        item.children,
        data.length ? data[data.length - 1].children : []
      )
    }
  })

  return data
}

const ButtonExport = ({tree}) => (
  <Button
    type='ghost'
    icon='download'
    href={`${'data'}: text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(beforeDownload([tree])[0])
    )}`}
    download={'map-navigation.json'}
    style={{float: 'right', marginRight: 20, background: '#FFF'}}
  >
    {I18n.t('button.export')}
  </Button>
)

export default ButtonExport
