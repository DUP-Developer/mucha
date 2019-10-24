import React from 'react' // eslint-disable-line
import { Icon, Tooltip, Popover, Modal } from 'antd' // eslint-disable-line
import Colors from '../../../Utils/Themes/Colors'
import I18n from '../../../i18n'
import Services from '../../../Services'
import openNotification from '../../../Utils/OpenNotification'
import MapNavigationTemp from '../../../Utils/MapNavigationTemp'
import _ from 'lodash'

const showDeleteConfirm = (screen, updateTree) => {
  Modal.confirm({
    title: I18n.t('mapNavigation.modal.confirm'),
    content: screen.label,
    okText: I18n.t('button.yes'),
    okType: 'danger',
    cancelText: I18n.t('button.no'),
    onOk: async () => {
      const result = await Services.MapNavigation.deleteScreen(screen._id)
      if (result) {
        if (MapNavigationTemp.get() === screen._id) {
          MapNavigationTemp.remove()
        }
        await updateTree()
        openNotification('success', I18n.t(result.status.message))
      }
    }
  })
}

const ListItem = ({ data, showModal, updateTree }) => {
  const content = (
    <div>
      <p
        onClick={() => {
          showModal('newScreen')
        }}
        style={{ cursor: 'pointer', color: Colors.DARK_BLUE }}
      >
        <Icon type="plus" />
        {I18n.t('mapNavigation.popover.actions.newScreen')}
      </p>
      <p
        onClick={() => {
          showModal('edit')
        }}
        style={{ cursor: 'pointer', color: Colors.YELLOW_ICON_EDIT }}
      >
        <Icon type="edit" />
        {I18n.t('mapNavigation.popover.actions.editScreen')}
      </p>
      <p
        onClick={() => showDeleteConfirm(data, updateTree)}
        style={{ cursor: 'pointer', color: Colors.REMOVE_BUTTON }}
      >
        <Icon type="delete" />
        {I18n.t('mapNavigation.popover.actions.removeScreen')}
      </p>
    </div>
  )

  // Se for o nó raiz
  if (data.label === 'Telas') {
    return (
      <p
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          height: '100%'
        }}
      >
        {data.label}
        <span
          onClick={() => {
            showModal('newScreen')
          }}
        >
          {/* Add tela no nível raiz */}
          <Tooltip placement="top" title={I18n.t('mapNavigation.tooltip.add')}>
            <Icon
              type="plus"
              style={{ marginRight: 8, color: Colors.DARK_BLUE }}
            />
          </Tooltip>
        </span>
      </p>
    )
  }
  return (
    <p
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        height: '100%'
      }}
    >
      {data.label}
      <span>
        { _.isEmpty(data.items) &&  
        <Tooltip placement="top" title={I18n.t('mapNavigation.tooltip.noItems')}>
          <Icon
            type="warning"
            style={{ marginRight: 8, color: Colors.RED }}
          />
        </Tooltip>}
        
        {/* Descrição da tela */}
        <Tooltip placement="top" title={data.description}>
          <Icon
            type="info-circle"
            style={{ marginRight: 8, color: Colors.DARK_BLUE }}
          />
        </Tooltip>

        {/* Menu de ações */}
        <Popover
          placement="right"
          title={I18n.t('mapNavigation.popover.title')}
          content={content}
          trigger="click"
        >
          <Icon
            type="more"
            style={{ marginRight: 8, color: Colors.DARK_BLUE }}
          />
        </Popover>
      </span>
    </p>
  )
}
export default ListItem
