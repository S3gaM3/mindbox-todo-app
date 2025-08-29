import React from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { Stats } from './components/Stats';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getStats,
    getActiveTodos,
    getCompletedTodos
  } = useTodos();

  const stats = getStats();
  const activeTodos = getActiveTodos();
  const completedTodos = getCompletedTodos();

  return (
    <div className="container">
      <div className="todo-app">
        <h1 className="app-title">Mindbox ToDo</h1>
        
        <TodoInput onAdd={addTodo} />
        
        <Stats stats={stats} />
        
        <div className="todo-lists">
          <TodoList
            title="Все задачи"
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
          
          <TodoList
            title="Невыполненные задачи"
            todos={activeTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
          
          <TodoList
            title="Выполненные задачи"
            todos={completedTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
        
        {completedTodos.length > 0 && (
          <button
            className="clear-completed"
            onClick={clearCompleted}
          >
            Очистить выполненные ({completedTodos.length})
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
