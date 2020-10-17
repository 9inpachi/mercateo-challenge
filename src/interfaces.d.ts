interface ITodo {
  id: string,
  title: string,
  completed: boolean,
  labels: string[]
}

interface ITodoItemProps {
  key: string,
  todo: ITodo;
  editing?: boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
  onLabelReplace?: (value: string, newValue: string) => void,
  onLabelRemove?: (value: string) => void
}

interface ITodoItemState {
  editText: string
}

interface ITodoFooterProps {
  completedCount: number;
  onClearCompleted: any;
  nowShowing: string;
  count: number;
}


interface ITodoModel {
  key: any;
  todos: Array<ITodo>;
  onChanges: Array<any>;
  subscribe(onChange);
  inform();
  addTodo(title: string, labels?: string[]);
  toggleAll(checked);
  toggle(todoToToggle);
  destroy(todo);
  save(todoToSave, text);
  clearCompleted();
  replaceLabel(todoToChange: ITodo, oldLabel: string, newLabel: string): void;
  removeLabel(todoToChange: ITodo, label: string): void;
}

interface IAppProps {
  model: ITodoModel;
}

interface IAppState {
  editing?: string;
  nowShowing?: string,
  newTodoLabels?: string[]
}

interface ITodoLabelProps {
  editable?: boolean,
  deletable?: boolean,
  onReplace?: (value: string) => void,
  onRemove?: (value: string) => void,
  label: string
}

interface ITodoLabelState {
  editText: string,
  editing?: boolean
}
