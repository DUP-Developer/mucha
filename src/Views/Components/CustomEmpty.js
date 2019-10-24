import React from 'react'
import { Empty } from 'antd'
import I18n from '../../i18n'

const CustomEmpty = () => (
  <span>
    <img
      src={Empty.PRESENTED_IMAGE_DEFAULT}
      alt={I18n.t('general.empty.label')}
    />
    <p>{I18n.t('general.empty.label')}</p>
  </span>
)

export default CustomEmpty
