import React from 'react'
import { Typography } from 'antd'
import Metrics from './Metrics'
import Colors from '../../Utils/Themes/Colors'
import I18n from '../../i18n'

function ItemTabContent ({ list, item }) {
  return (
    <>
      <Typography.Title
        level={2}
        style={{
          color: Colors.DARK_BLUE,
          fontWeight: 'bold',
          marginLeft: 30,
          marginBottom: 0
        }}
      >
        {item.name || item.title}
      </Typography.Title>
      <hr
        style={{ border: `0.5px solid ${Colors.MID_BLUE}`, marginLeft: 30 }}
      />
      <Typography.Title
        level={4}
        style={{
          color: Colors.DARK_BLUE,
          fontWeight: 'bold',
          marginLeft: 30,
          marginBottom: 20
        }}
      >
        {I18n.t('item.tab.title')}
      </Typography.Title>
      {/* <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}`, marginLeft: 30 }} /> */}
      <Metrics list={list} item={item} />
    </>
  )
}

export default ItemTabContent
