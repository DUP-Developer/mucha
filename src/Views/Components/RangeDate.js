import React, { Component } from 'react'
import { DatePicker } from 'antd'
import I18n from '../../i18n'
import moment from 'moment'
import 'moment/locale/pt-br'
import Auth from '../../Utils/Auth'

moment.locale(Auth.getLocale())

class RangeDate extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  }

  // Desativa datas maiores que a data final
  disabledStartDate = startValue => {
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  // Desativa datas finais menores que a inicial
  disabledEndDate = endValue => {
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }

    return endValue.valueOf() <= startValue.valueOf()
  }

  onChange = async (field, value) => {
    await this.setState({
      [field]: value
    })

    if (!this.state.startValue || !this.state.endValue) {
      return this.props.handleFilter(this.props.data.original)
    }

    this.filter(
      this.state.startValue,
      this.state.endValue
    )
  }

  // Chama o onChange com o campo startValue
  onStartChange = value => {
    this.onChange('startValue', value)
  }

  // Chama o onChange com o campo enValue
  onEndChange = value => {
    this.onChange('endValue', value)
  }

  // Abre a caixa do datePiker
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  // Fecha a caixa do datePiker
  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  }

  filter = (startValue, endValue) => {    
    const filtered = this.props.data.original.filter(report => 
      moment(report.date).isBetween(startValue, endValue, 'day', '[]')
    )
    this.props.handleFilter(filtered)
  }

  setCalendarSubtitles = (locale) => {
    locale.lang.nextMonth         = I18n.t('report.filter.subtitles.nextMonth')
    locale.lang.nextYear          = I18n.t('report.filter.subtitles.nextYear')
    locale.lang.previousMonth     = I18n.t('report.filter.subtitles.previousMonth')
    locale.lang.previousYear      = I18n.t('report.filter.subtitles.previousYear')
    locale.lang.previousDecade    = I18n.t('report.filter.subtitles.previousDecade')
    locale.lang.nextDecade        = I18n.t('report.filter.subtitles.nextDecade')
    locale.lang.previousCentury   = I18n.t('report.filter.subtitles.previousCentury')
    locale.lang.nextCentury       = I18n.t('report.filter.subtitles.nextCentury')
    locale.lang.dateSelect        = I18n.t('report.filter.subtitles.dateSelect')
    locale.lang.monthSelect       = I18n.t('report.filter.subtitles.monthSelect')
    locale.lang.yearSelect        = I18n.t('report.filter.subtitles.yearSelect')
    locale.lang.decadeSelect      = I18n.t('report.filter.subtitles.decadeSelect')
  }

  render() {
    const { startValue, endValue, endOpen } = this.state

    // pegar o moment padrão com lacale setado no inicio do componente
    let locale = moment()
    
    // setar o nome dos dias contraidos no atributo que o ant design utiliza
    locale._locale._weekdaysMin = locale._locale._weekdaysShort

    // Setar legendas das ações do calendario
    this.setCalendarSubtitles(locale)

    return (
      <span style = {{padding: 5}}>
        <DatePicker
          locale={locale}
          disabledDate={this.disabledStartDate}
          format={I18n.t('general.format.date')}
          value={startValue}
          placeholder={I18n.t('report.filter.labels.start')}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          showToday={false}
          style = {{ marginRight: 3 }}
        />
        -
        <DatePicker
          locale={locale}
          disabledDate={this.disabledEndDate}
          format={I18n.t('general.format.date')}
          value={endValue}
          placeholder={I18n.t('report.filter.labels.end')}
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          showToday={false}
          style = {{ marginLeft: 3 }}
        />
      </span>
    )
  }
}

export default RangeDate
