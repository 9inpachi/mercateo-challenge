/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */

/// <reference path="./interfaces.d.ts"/>

import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";
import TodoLabel from "./todoLabel";

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {

  public state: ITodoItemState;
  private editField: React.RefObject<HTMLInputElement>;

  constructor(props: ITodoItemProps) {
    super(props);
    this.editField = React.createRef();
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event: React.FormEvent) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  public handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event: React.FormEvent) {
    var input: any = event.target;
    this.setState({ editText: input.value });
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  public shouldComponentUpdate(nextProps: ITodoItemProps, nextState: ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  public componentDidUpdate(prevProps: ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = (ReactDOM.findDOMNode(this.editField.current) as HTMLInputElement);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  /**
   * Handle add label to avoid duplication of labels.
   */
  public handleAddLabel() {
    let labelIndex = this.props.todo.labels.length;
    let newLabel = 'Label ' + labelIndex;
    while (this.props.todo.labels.includes(newLabel)) {
      labelIndex++;
      newLabel = 'Label ' + labelIndex;
    }
    this.props.onLabelAdd(newLabel);
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={e => this.handleEdit()}>
            {this.props.todo.title}
          </label>
          <div className="todo-item-labels">
            {this.props.todo.labels && this.props.todo.labels.length > 0 &&
              this.props.todo.labels.map((label, i) => {
                return <TodoLabel
                  key={this.props.todo.id + '-label-' + i}
                  label={label}
                />;
              })}
          </div>
          <div className="actions">
            <button className="action-item edit-icon" onClick={e => this.handleEdit()} />
            <button className="action-item remove-icon" onClick={this.props.onDestroy} />
          </div>
        </div>
        <div className="edit-mode">
          <input
            ref={this.editField}
            className="edit"
            value={this.state.editText}
            onChange={e => this.handleChange(e)}
            onKeyDown={e => this.handleKeyDown(e)}
          />
          <button className="tick-icon" onClick={this.handleSubmit.bind(this)} />
          <div className="todo-item-labels todo-item-labels-edit">
            {this.props.todo.labels && this.props.todo.labels.length > 0 &&
              this.props.todo.labels.map((label, i) => {
                return <TodoLabel
                  key={this.props.todo.id + '-label-edit-' + i}
                  label={label}
                  editable={true}
                  deletable={true}
                  onReplace={(newLabel) => this.props.onLabelReplace(label, newLabel)}
                  onRemove={(value) => this.props.onLabelRemove(value)}
                />;
              })}
            <button className="add-icon" onClick={this.handleAddLabel.bind(this)} />
          </div>
        </div>
      </li>
    );
  }
}

export { TodoItem };
