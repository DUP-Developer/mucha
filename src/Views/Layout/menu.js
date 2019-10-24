import I18n from '../../i18n'

export default [
  {
    path: '/',
    rule: 'admin|engineer',
    icon: 'home',
    title: I18n.t('sidebar.home')
  },
  {
    path: '/devices',
    rule: 'admin',
    icon: 'desktop',
    title: I18n.t('sidebar.device')
  },
  {
    path: '/users',
    rule: 'admin',
    icon: 'user',
    title: I18n.t('sidebar.user')
  },
  {
    path: '/items',
    rule: 'admin',
    icon: 'check-square',
    title: I18n.t('sidebar.item')
  },
  {
    path: '/reports',
    rule: 'admin|engineer',
    icon: 'file-text',
    title: I18n.t('sidebar.report')
  }
]