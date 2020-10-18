/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/// <reference path="./interfaces.d.ts"/>

declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import TodoLabel from "./todoLabel";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state: IAppState;
  private newField: React.RefObject<HTMLInputElement>;
  private labelField: React.RefObject<HTMLInputElement>;

  constructor(props: IAppProps) {
    super(props);
    this.newField = React.createRef();
    this.labelField = React.createRef();
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodoLabels: []
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, { nowShowing: ALL_TODOS }),
      '/active': setState.bind(this, { nowShowing: ACTIVE_TODOS }),
      '/completed': setState.bind(this, { nowShowing: COMPLETED_TODOS })
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    this.addTodoItem();
  }

  public addTodoItem() {
    var val = (ReactDOM.findDOMNode(this.newField.current) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val, this.state.newTodoLabels);
      (ReactDOM.findDOMNode(this.newField.current) as HTMLInputElement).value = '';
      this.setState({ newTodoLabels: [] });
    }
  }

  public toggleAll(event: React.FormEvent) {
    var target: any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle: ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo: ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo: ITodo) {
    this.setState({ editing: todo.id });
  }

  public save(todoToSave: ITodo, text: String) {
    this.props.model.save(todoToSave, text);
    this.setState({ editing: null });
  }

  public cancel() {
    this.setState({ editing: null });
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public addLabel(e: React.KeyboardEvent) {
    if (e.keyCode !== ENTER_KEY) {
      return;
    }

    const newLabelField = (ReactDOM.findDOMNode(this.labelField.current) as HTMLInputElement);
    const val = newLabelField.value;
    if (val && !this.state.newTodoLabels.includes(val)) {
      this.setState({ newTodoLabels: [...this.state.newTodoLabels, val] });
      newLabelField.value = '';
    }
  }

  public deleteLabel(value: string) {
    if (value) {
      const todoLabels = this.state.newTodoLabels;
      todoLabels.splice(todoLabels.indexOf(value), 1);
      this.setState({ newTodoLabels: todoLabels });
    }
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={e => this.cancel()}
          onLabelReplace={(value, newValue) => {
            this.props.model.replaceLabel(todo, value, newValue)
          }}
          onLabelRemove={(value) => this.props.model.removeLabel(todo, value)}
          onLabelAdd={(value) => this.props.model.addLabel(todo, value)}
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={e => this.clearCompleted()}
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <div className="new-todo-wrapper">
            <input
              ref={this.newField}
              className="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={e => this.handleNewTodoKeyDown(e)}
              autoFocus={true}
            />
            <button className="add-todo" onClick={this.addTodoItem.bind(this)} />

            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              onChange={e => this.toggleAll(e)}
              checked={activeTodoCount === 0}
            />
            <label htmlFor="toggle-all">
              Mark all as complete
            </label>
          </div>
          <div className="labels">
            <input
              ref={this.labelField}
              className="label-input"
              placeholder="Add label"
              onKeyDown={this.addLabel.bind(this)}
              autoFocus={true}
            />
            <div className="labels-added">
              {this.state.newTodoLabels && this.state.newTodoLabels.length > 0 &&
                this.state.newTodoLabels.map((label, i) => {
                  return <TodoLabel
                    key={this.props.model.key + '-todo-label-' + i}
                    editable={false}
                    deletable={true}
                    label={label}
                    onRemove={this.deleteLabel.bind(this)}
                  />
                })}
            </div>
          </div>
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model} />,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();
