import React from 'react'
import {
  Typography,
  List,
  Avatar,
  Icon,
  Modal,
  Row,
  Col,
  Tabs,
  Card
} from 'antd' // eslint-disable-line
import i18n from '../../i18n'
import { METRIC_STATUS } from '../../Utils/Constants'
import Colors from '../../Utils/Themes/Colors'
import * as Utils from '../../Utils'


const { TabPane } = Tabs

export default class extends React.Component {
  state = {
    visible: false,
    image: ''
  }

  openModal(image) {
    this.setState({ image, visible: !this.state.visible })
  }

  render() {
    return (
      <div>
        {/* modal */}
        <Modal
          title={i18n.t('report.title.previewImage')}
          visible={this.state.visible}
          width={720}
          footer={null}
          onCancel={() =>
            this.setState({
              visible: false
            })
          }
          onOk={() =>
            this.setState({
              visible: false
            })
          }
        >
          <img style={{ width: '100%' }} src={this.state.image} alt='' />
        </Modal>

        {/* content */}
        {this.props.data.map((screen, it) => (
          <Card style={{ padding: '15px 15px', marginBottom: 10 }}>
            <div key={it} id={Utils.transformNameId(screen.label)}>
              <Row>
                <Col span={16}>
                  <Typography.Title level={2}>
                    <Icon
                      type="layout"
                      style={{
                        color: Colors.ORANGE,
                        size: 30,
                        padding: '2px 10px 2px 2px'
                      }}
                    />
                    {screen.label}
                  </Typography.Title>
                  <br />
                  <Typography.Title level={4}>
                    {i18n.t('report.title.description')}
                  </Typography.Title>
                  <hr style={{ border: `0.5px solid ${Colors.GRAY_LIGHT}` }} />

                  <Typography.Text type="secondary">
                    {screen.description}
                  </Typography.Text>

                  <Typography.Title level={4}>
                    {i18n.t('report.title.comments')}
                  </Typography.Title>
                  <hr style={{ border: `0.5px solid ${Colors.GRAY_LIGHT}` }} />
                  <Typography.Text>
                    {screen.comments || i18n.t('report.title.noComments')}
                  </Typography.Text>
                </Col>
                <Col span={8} style={{ padding: 20 }}>
                  <Avatar
                    size={300}
                    shape="square"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.openModal(screen.image)}
                    src={screen.image}
                  />
                </Col>
              </Row>

              <hr style={{ border: `0.5px solid ${Colors.GRAY_LIGHT}` }} />
              <Tabs tabPosition={'left'} style={{ marginTop: 20 }}>
                {screen.items.map((item, it2) => (
                  <TabPane tab={item.name} key={it2}>
                    <div>
                      <Typography.Title level={3}>{item.name}</Typography.Title>
                      <Typography.Text type="secondary">
                        {item.description}
                      </Typography.Text>

                      <Typography.Text style={{ fontWeight: 'bold' }}>
                        {i18n.t('report.title.description')}
                      </Typography.Text>
                      <hr
                        style={{ border: `0.5px solid ${Colors.GRAY_LIGHT}` }}
                      />
                      <Typography.Text type="secondary">
                        {item.description}
                      </Typography.Text>

                      <List
                        // size="large"
                        header={
                          <Typography.Text style={{ fontWeight: 'bold' }}>
                            {i18n.t('report.title.metrics')}
                          </Typography.Text>
                        }
                        // bordered
                        dataSource={item.metrics}
                        renderItem={item => {
                          let color = ''
                          let icon = ''

                          switch (item.accepted) {
                            case METRIC_STATUS.NO:
                              color = Colors.RED
                              icon = 'close'
                              break
                            case METRIC_STATUS.YES:
                              color = Colors.GREEN
                              icon = 'check'
                              break
                            default:
                              color = Colors.GRAY
                              icon = 'minus'
                              break
                          }

                          return (
                            <List.Item>
                              <Icon
                                type={icon}
                                style={{ color: color, size: 30, padding: 10 }}
                              />
                              {item.title}
                            </List.Item>
                          )
                        }}
                      />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </div>
          </Card>
        ))}
      </div>
    )
  }
}
