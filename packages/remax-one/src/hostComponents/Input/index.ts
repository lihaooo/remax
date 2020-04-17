import * as React from 'react';
import { InputEvent } from '../../types';
import { createCallback, createInputEvent } from '../../createHostComponent';
import { InputProps } from './props';

export interface InputState {
  value?: string;
  controlled: boolean;
}

export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps = {
    'toutiao-selection-end': 999,
    'toutiao-selection-start': 999,
    'wechat-selection-end': 999,
    'wechat-selection-start': 999,
  };

  state: InputState = {
    value: '',
    // 阿里
    controlled: false,
  };

  constructor(props: InputProps) {
    super(props);

    const controlled = props.value !== undefined;
    const value = controlled ? props.value : props.defaultValue;

    this.state = {
      value,
      controlled,
    };
  }

  componentDidUpdate() {
    if (this.props.value !== undefined && this.props.value !== this.state.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleInput = (e: InputEvent) => {
    const { controlled } = this.state;

    if (!controlled) {
      this.setState({ value: e.target.value });
    }

    if (typeof this.props.onInput === 'function') {
      return this.props.onInput(e);
    }

    // 微信
    // 注意，微信要对 input 受控，必须要在 onInput 方法返回值
    return controlled ? this.props.value : e.target.value;
  };

  render() {
    const inputProps = {
      ...this.props,
      onInput: createCallback(this.handleInput, createInputEvent),
    };

    if (inputProps.onConfirm) {
      inputProps.onConfirm = createCallback(this.props.onConfirm, createInputEvent);
    }

    if (inputProps.onFocus) {
      inputProps.onFocus = createCallback(this.props.onFocus, createInputEvent);
    }

    if (inputProps.onBlur) {
      inputProps.onBlur = createCallback(this.props.onBlur, createInputEvent);
    }

    if (process.env.REMAX_PLATFORM === 'wechat' || process.env.REMAX_PLATFORM === 'toutiao') {
      inputProps.maxlength = inputProps.maxlength ?? 140;
    }

    return React.createElement('input', {
      ...inputProps,
      ...this.state,
    });
  }
}
