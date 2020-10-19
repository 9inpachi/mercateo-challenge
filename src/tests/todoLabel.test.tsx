import * as React from 'react';
import { shallow } from 'enzyme';

import TodoLabel from '../todoLabel';

describe('TodoLabel component', () => {

  const LABEL = "Some label";

  it('should have label from prop', () => {
    const label = shallow(<TodoLabel label={LABEL} />);

    expect(label.find('span').text()).toBe(`@${LABEL}`);
  });

  it('should be editable or deletable if props defined', () => {
    const label = shallow(<TodoLabel
      label={LABEL}
    />);

    expect(label.find('.todo-label-actions .edit-icon').exists()).toBe(false);
    expect(label.find('.todo-label-actions .remove-icon').exists()).toBe(false);

    label.find('span').simulate('dblclick');

    expect((label.state() as ITodoLabelState).editing).toBe(false);

    const labelEditDel = shallow(<TodoLabel
      label={LABEL}
      editable={true}
      deletable={true}
    />);

    expect(labelEditDel.find('.todo-label-actions .edit-icon').exists()).toBe(true);
    expect(labelEditDel.find('.todo-label-actions .remove-icon').exists()).toBe(true);
  });

  it('should be editing on double click or on icon click', () => {
    const labelEditDel = shallow(<TodoLabel
      label={LABEL}
      editable={true}
      deletable={true}
    />);

    const labelEdit = (enableEditing: () => void) => {
      expect(labelEditDel.find('.todo-label').hasClass('editing')).toBe(false);
      expect((labelEditDel.state() as ITodoLabelState).editing).toBe(false);

      enableEditing();

      expect(labelEditDel.find('.todo-label').hasClass('editing')).toBe(true);
      expect((labelEditDel.state() as ITodoLabelState).editing).toBe(true);

      labelEditDel.find('.todo-label-input').simulate('keyDown', { keyCode: 20 });
      labelEditDel.find('.todo-label-input').simulate('keyDown', { keyCode: 13 });
    }

    // Double click
    labelEdit(() => {
      labelEditDel.find('span').simulate('dblclick');
    });

    // Icon click
    labelEdit(() => {
      labelEditDel.find('.edit-icon').simulate('click');
    });
  });

  it('should exit editing on blur', () => {
    const labelEditable = shallow(<TodoLabel
      label={LABEL}
      editable={true}
      onReplace={jest.fn()}
    />);

    expect((labelEditable.state() as ITodoLabelState).editing).toBe(false);

    labelEditable.find('span').simulate('dblclick');

    expect((labelEditable.state() as ITodoLabelState).editing).toBe(true);

    labelEditable.find('.todo-label-input').simulate('change', { target: { value: 'New label' } });
    labelEditable.find('.todo-label-input').simulate('blur');

    expect((labelEditable.state() as ITodoLabelState).editing).toBe(false);

    // For coverage

    labelEditable.find('span').simulate('dblclick');
    labelEditable.find('.todo-label-input').simulate('change', { target: { value: '' } });
    labelEditable.find('.todo-label-input').simulate('blur');

    expect((labelEditable.state() as ITodoLabelState).editing).toBe(false);
  });

  it('should call update label value callback', () => {
    let labelUpdateValue = 'New label';

    const mockOnReplace = jest.fn();

    const labelToUpdate = shallow(<TodoLabel
      label={LABEL}
      editable={true}
      deletable={true}
      onReplace={mockOnReplace}
    />);

    expect((labelToUpdate.state() as ITodoLabelState).editText).toBe(LABEL);

    labelToUpdate.find('span').simulate('dblclick');
    labelToUpdate.find('.todo-label-input').simulate('change', { target: { value: labelUpdateValue } });
    labelToUpdate.find('.todo-label-input').simulate('keyDown', { keyCode: 13 });

    expect((labelToUpdate.state() as ITodoLabelState).editText).toBe(labelUpdateValue);
    expect(mockOnReplace).toHaveBeenCalled();
  });

  it('should call delete label callback', () => {
    const mockOnDelete = jest.fn();

    const labelToDelete = shallow(<TodoLabel
      label={LABEL}
      deletable={true}
      onRemove={mockOnDelete}
    />);

    labelToDelete.find('.remove-icon').simulate('click');

    expect(mockOnDelete).toHaveBeenCalled();

    const labelNotDeletable = shallow(<TodoLabel
      label={LABEL}
      deletable={false}
    />);

    expect(labelNotDeletable.find('.remove-icon').exists()).toBe(false);
  });
});
