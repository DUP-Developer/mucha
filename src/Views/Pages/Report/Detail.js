import React from 'react'
import Colors from '../../../Utils/Themes/Colors'
import i18n from '../../../i18n'
import { Icon, Card, Typography, Row, Col, Button, BackTop, Badge } from 'antd' // eslint-disable-line
import Services from '../../../Services'
import moment from 'moment'
import Chart from 'react-apexcharts'
import pdf from '../../../Utils/generator/report.pdf'
import _ from 'lodash'
// comtainers
import Summary from '../../Components/Summary'
import DetailingReport from '../../Components/DetailingReport'

export default class extends React.Component {
  state = {
    report: this.props.location.state,
    mapNavigationSummary: [],
    goTo: undefined,
    pdf: null
  }

  async componentDidMount() {
    let summary = await Services.MapNavigation.getMapNavigation(
      this.state.report.device.mapNavigation
    )

    // metodo responsavel por ajustar o sumario que vem com o que tem no relatorio
    summary = this._prepareSummaryList(this.state.report.screens, summary)
    this.setState({
      mapNavigationSummary: [summary]
    })
  }

  /**
   * methodo recursivo que faz o filtro das informações que contem no relatorio
   * @param {Array} screens
   * @param {Object} summary
   */
  _prepareSummaryList(screens, summary) {
    if (summary.children && summary.children.length > 0) {
      summary.children = _.xorBy(summary, screens, 'label')
    }

    return summary
  }

  render() {
    return (
      <>
        <Row
          type="flex"
          justify="space-between"
          style={{
            color: Colors.DARK_BLUE,
            marginBottom: 20
          }}
        >
          <Col span={18} style={{ fontSize: 21 }}>
            <Icon type="desktop" style={{ marginRight: 8 }} />
            {i18n.t('report.title.page')}
          </Col>
          <Col>
            <Button
              type="primary"
              icon="download"
              size={10}
              onClick={() => {
                pdf.generate(this.state.report, this.state.mapNavigationSummary)
              }}
            >
              Download
            </Button>
          </Col>
        </Row>
        <Row type="flex" justify="space-between">
          <Col span={12}>
            <Card style={{ padding: '15px 15px', marginBottom: 10 }}>
              <Typography.Text
                level={4}
                style={{
                  color: Colors.DARK_BLUE,
                  fontWeight: 'bold',
                  fontSize: 18
                }}
              >
                {i18n.t('report.title.generalData')}
              </Typography.Text>
              <br />
              <Row>
                <Col span={20}>
                  <Typography.Text
                    level={4}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12
                    }}
                  >
                    {i18n.t('report.table.title.device')}
                  </Typography.Text>
                </Col>
                <Col span={4}>
                  <Typography.Text
                    level={4}
                    style={{
                      justifyContent: 'flex-end',
                      color: Colors.DARK_BLUE,
                      fontWeight: 'bold',
                      fontSize: 12
                    }}
                  >
                    {this.state.report.device.name}
                  </Typography.Text>
                </Col>
              </Row>
              <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />
              <Row>
                <Chart
                  options={{
                    dataLabels: {
                      enabled: false
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          labels: {
                            show: true,
                            value: {
                              show: true,
                              formatter: data => `${data}%`
                            }
                          },
                          total: {
                            show: true,
                            formatter: () => {}
                          }
                        }
                      }
                    },
                    labels: [i18n.t('report.table.columns.consistency')]
                  }}
                  series={[this.state.report.consistency.toFixed(2) * 100]}
                  type="radialBar"
                  width="450"
                />
              </Row>
              <Row>
                <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />
                <Col span={12}>
                  <Badge
                    color={'orange'}
                    text={
                      <Typography.Text style={{ fontWeight: 'bold' }}>
                        {i18n.t('report.table.columns.date')}
                      </Typography.Text>
                    }
                  />
                  <br />
                  <Typography.Text style={{ paddingLeft: 15 }}>
                    {moment(this.state.report.date).format(
                      i18n.t('general.format.date')
                    )}
                  </Typography.Text>
                </Col>
                <Col span={12}>
                  <Badge
                    color={'green'}
                    text={
                      <Typography.Text style={{ fontWeight: 'bold' }}>
                        {i18n.t('report.table.title.user')}
                      </Typography.Text>
                    }
                  />
                  <br />
                  <Typography.Text style={{ paddingLeft: 15 }}>
                    {this.state.report.user.name}
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={11}>
            <Card style={{ padding: '15px 15px', marginBottom: 10 }}>
              <Typography.Text
                level={4}
                style={{
                  color: Colors.DARK_BLUE,
                  fontWeight: 'bold',
                  fontSize: 18
                }}
              >
                {i18n.t('report.title.summary')}
              </Typography.Text>
              <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

              <div>
                <Row>
                  <Row>
                    <Summary
                      onSelect={data =>
                        this.setState({
                          goTo: data
                        })
                      }
                      data={this.state.mapNavigationSummary}
                    />
                  </Row>
                  <Typography.Text
                    level={4}
                    style={{
                      color: Colors.DARK_BLUE,
                      fontWeight: 'bold',
                      fontSize: 18
                    }}
                  >
                    {i18n.t('report.title.legend')}:
                  </Typography.Text>

                  <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />
                  <Row>
                    <Col span="8">
                      <Icon
                        type="close"
                        style={{ color: Colors.RED, size: 30, padding: 2 }}
                      />
                      {i18n.t('item.metric.status.no')}
                    </Col>

                    <Col span="8">
                      <Icon
                        type="check"
                        style={{ color: Colors.GREEN, size: 30, padding: 2 }}
                      />
                      {i18n.t('item.metric.status.yes')}
                    </Col>

                    <Col span="8">
                      <Icon
                        type="minus"
                        style={{ color: Colors.GRAY, size: 30, padding: 2 }}
                      />
                      {i18n.t('item.metric.status.noApply')}
                    </Col>
                  </Row>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        <Typography.Text
          level={3}
          style={{
            color: Colors.DARK_BLUE,
            fontWeight: 'bold',
            fontSize: 18
          }}
        >
          <Icon
            type="profile"
            style={{
              color: Colors.DARK_BLUE,
              size: 30,
              padding: '2px 8px 20px 2px'
            }}
          />
          {i18n.t('report.title.detailing')}
        </Typography.Text>

        <DetailingReport data={this.state.report.screens} />
        <BackTop />
      </>
    )
  }
}
