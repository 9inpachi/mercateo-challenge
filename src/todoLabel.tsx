/// <reference path="./interfaces.d.ts"/>

import * as React from 'react';

class TodoLabel extends React.Component<ITodoLabelProps, ITodoLabelState> {

  constructor(props: ITodoLabelProps) {
    super(props);
    this.state = {
      editing: false
    };
  }

  render() {
    return (
      <div className="todo-label">
        <label>{this.props.label}</label>
        <div className="todo-label-actions">
          {this.props.editable && <button className="todo-label-action edit-icon" />}
          {this.props.deletable && <button
            className="todo-label-action remove-icon"
            onClick={e => this.props.onDelete(this.props.label)}
          />}
        </div>
      </div>
    );
  }

}

export default TodoLabel;
