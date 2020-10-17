/// <reference path="./interfaces.d.ts"/>

import * as React from 'react';
import classNames = require('classnames');
import { ENTER_KEY } from './constants';

class TodoLabel extends React.Component<ITodoLabelProps, ITodoLabelState> {

  constructor(props: ITodoLabelProps) {
    super(props);
    this.state = {
      editText: this.props.label,
      editing: false
    };
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ editText: e.target.value });
  }

  private handleSubmit(e: React.FormEvent) {
    if (this.props.onReplace) {
      this.props.onReplace(this.state.editText);
    }
    this.setState({ editing: false });
  }

  private handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode !== ENTER_KEY) {
      return;
    } else {
      if (this.props.onReplace) {
        this.props.onReplace(this.state.editText);
      }
      this.setState({ editing: false });
    }
  }

  render() {
    return (
      <div className={classNames({
        "todo-label": true,
        editing: this.state.editing,
        editable: this.props.editable
      })}>
        <span>{this.props.label}</span>
        {this.props.editable &&
          <input
            className="todo-label-input"
            value={this.state.editText}
            onChange={this.handleChange.bind(this)}
            onBlur={this.handleSubmit.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
          />}
        <div className="todo-label-actions">
          {this.props.editable &&
            <button
              className="todo-label-action edit-icon"
              onClick={() => this.setState({ editing: true })}
            />}
          {this.props.deletable &&
            <button
              className="todo-label-action remove-icon"
              onClick={e => this.props.onRemove(this.props.label)}
            />}
        </div>
      </div>
    );
  }

}

export default TodoLabel;
