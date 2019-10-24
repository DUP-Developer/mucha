import React, { Component } from 'react'
import InputMask from 'react-input-mask';

export default class InputPhone extends Component {
  render() {
    return (
      <InputMask
        {...this.props}
        mask="(99) 99999 9999"
        maskChar=" "
        className='ant-input'
      />
    )
  }
}
