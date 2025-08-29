import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  title: string;
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  title, 
  todos, 
  onToggle, 
  onDelete 
}) => {
  return (
    <div className="todo-list">
      <h3 className="list-title">{title}</h3>
      {todos.length === 0 ? (
        <div className="empty-list">
          {title === 'Все задачи' ? 'Нет задач' : 
           title === 'Невыполненные задачи' ? 'Все задачи выполнены!' : 
           'Нет выполненных задач'}
        </div>
      ) : (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};
