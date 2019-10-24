import React, { Component } from 'react'
import Color from '../Utils/Themes/Colors'
import I18n from '../i18n'
export default class Page404 extends Component {
  render () {
    return (
      <div
        style={{
          height: '100vh',
          backgroundColor: Color.DARK_BLUE,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h1 style={{ fontSize: '10em', color: Color.WHITE }}>404</h1>
        <p style={{ color: Color.WHITE }}>
          {I18n.t('page404.notFound')}
          {', '}
          <a href="/" style={{ color: Color.YELLOW }}>
            {I18n.t('page404.goback')}
          </a>
        </p>
      </div>
    )
  }
}
