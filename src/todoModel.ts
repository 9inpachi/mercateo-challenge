/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

/// <reference path="./interfaces.d.ts"/>

import { Utils } from "./utils";

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel implements ITodoModel {

  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string, labels?: string[]) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false,
      labels: labels ? labels : []
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }

  public changeLabel(todoToChange: ITodo, label: string, onTodoFound: (todo: ITodo) => ITodo) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      if (todo !== todoToChange) {
        return todo;
      } else {
        const updatedTodo = onTodoFound(todo);
        return Utils.extend({}, todo, { labels: updatedTodo.labels });
      }
    });

    this.inform();
  }

  public replaceLabel(todoToChange: ITodo, oldLabel: string, newLabel: string) {
    this.changeLabel(todoToChange, oldLabel, (todo) => {
      const oldLabelIndex = todo.labels.indexOf(oldLabel);
      if (oldLabelIndex !== -1) {
        todo.labels[oldLabelIndex] = newLabel;
      }
      return todo;
    });
  }

  public removeLabel(todoToChange: ITodo, label: string) {
    this.changeLabel(todoToChange, label, (todo) => {
      todo.labels.splice(todo.labels.indexOf(label), 1);
      return todo;
    });
  }
}

export { TodoModel };
