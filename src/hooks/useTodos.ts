import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoStats } from '../types';

const STORAGE_KEY = 'mindbox-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Загрузка задач из localStorage при инициализации
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error parsing saved todos:', error);
      }
    }
  }, []);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Добавление новой задачи
  const addTodo = useCallback((text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos(prev => [newTodo, ...prev]);
    }
  }, []);

  // Переключение статуса задачи
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Удаление задачи
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Очистка выполненных задач
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Получение статистики
  const getStats = useCallback((): TodoStats => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const remaining = total - completed;
    
    return { total, completed, remaining };
  }, [todos]);

  // Получение списков задач
  const getActiveTodos = useCallback(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const getCompletedTodos = useCallback(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getStats,
    getActiveTodos,
    getCompletedTodos
  };
};
