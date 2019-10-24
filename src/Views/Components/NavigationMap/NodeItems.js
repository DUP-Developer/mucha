import React from 'react'
import { List, Typography, Button, Icon, Tooltip } from 'antd'
import Colors from '../../../Utils/Themes/Colors'
import I18n from '../../../i18n'

class NodeItems extends React.Component {
  getData () {
    return this.props.data ? this.props.data.items : []
  }

  render () {
    return (
      <>
        <div className="nodeItems">
          <Typography.Title
            level={4}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: Colors.DARK_BLUE,
              fontWeight: 'bold',
              marginTop: 0,
              marginBottom: 10,
              fontSize: 14,
              width: '100%',
              textAlign: 'center'
            }}
          >
            {this.props.data
              ? this.props.data.label
              : 'Nenhuma tela selecionada'}
          </Typography.Title>
          <div
            style={{
              border: `solid 0.5px ${Colors.BLUE}`,
              padding: 5,
              height: '89%',
              borderRadius: '8px'
            }}
          >
            <Typography.Title
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 14,
                marginTop: 0,
                width: '100%',
                textAlign: 'center'
              }}
            >
              { I18n.t('mapNavigation.screenItems.title') }
            </Typography.Title>

            <div className="demo-infinite-container">
              <List
                locale={{ emptyText: I18n.t('mapNavigation.screenItems.empty') }}
                dataSource={this.getData()}
                renderItem={item => (
                  <List.Item key={item._id} style={{ height: 30, width: '100%' }}>
                    <List.Item.Meta description={<span>{item.name}</span>} className = {'node-item-list'} style={{ width: '95%' }} />
                    <Tooltip placement="top" title={item.description}>
                      <Icon
                        type="info-circle"
                        style={{ color: Colors.DARK_BLUE, width: '5%' }}
                      />
                    </Tooltip>
                  </List.Item>
                )}
              />
            </div>
            <Button
              shape="circle"
              icon="plus"
              style={{
                float: 'right',
                margin: '20px 10px 8px',
                color: this.props.data.label === 'Telas' ? '#ddd' : Colors.DARK_BLUE,
                borderColor: this.props.data.label === 'Telas' ? '#ddd' : Colors.DARK_BLUE
              }}
              onClick={() =>
                this.props.showModal('editItemToScreen', this.props.data)
              }
              disabled = {this.props.data.label === 'Telas'}
            />
          </div>
        </div>
      </>
    )
  }
}

export default NodeItems
