import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

// Мокаем localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useTodos', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('initializes with empty todos array', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('adds new todo correctly', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Новая задача');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Новая задача');
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
    expect(result.current.todos[0].createdAt).toBeInstanceOf(Date);
  });

  it('does not add empty todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('');
      result.current.addTodo('   ');
    });
    
    expect(result.current.todos).toHaveLength(0);
  });

  it('trims whitespace from todo text', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('  Задача с пробелами  ');
    });
    
    expect(result.current.todos[0].text).toBe('Задача с пробелами');
  });

  it('toggles todo completion status', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Тестовая задача');
    });
    
    const todoId = result.current.todos[0].id;
    
    act(() => {
      result.current.toggleTodo(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(true);
    
    act(() => {
      result.current.toggleTodo(todoId);
    });
    
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deletes todo correctly', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Задача для удаления');
    });
    
    act(() => {
      result.current.addTodo('Задача для сохранения');
    });
    
    // Проверяем, что у нас 2 задачи
    expect(result.current.todos).toHaveLength(2);
    
    // Порядок: [0] = "Задача для сохранения", [1] = "Задача для удаления"
    expect(result.current.todos[0].text).toBe('Задача для сохранения');
    expect(result.current.todos[1].text).toBe('Задача для удаления');
    
    // Удаляем первую задачу (последнюю добавленную) - "Задача для сохранения"
    const todoToDelete = result.current.todos[0].id;
    
    act(() => {
      result.current.deleteTodo(todoToDelete);
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Задача для удаления');
  });

  it('clears completed todos', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Невыполненная задача');
    });
    
    act(() => {
      result.current.addTodo('Выполненная задача');
    });
    
    act(() => {
      result.current.addTodo('Еще одна невыполненная');
    });
    
    // Проверяем, что у нас 3 задачи
    expect(result.current.todos).toHaveLength(3);
    
    // Порядок: [0] = "Еще одна невыполненная", [1] = "Выполненная задача", [2] = "Невыполненная задача"
    expect(result.current.todos[0].text).toBe('Еще одна невыполненная');
    expect(result.current.todos[1].text).toBe('Выполненная задача');
    expect(result.current.todos[2].text).toBe('Невыполненная задача');
    
    // Отмечаем вторую задачу как выполненную (индекс 1)
    const completedTodoId = result.current.todos[1].id;
    act(() => {
      result.current.toggleTodo(completedTodoId);
    });
    
    // Проверяем, что задача отмечена как выполненная
    expect(result.current.todos[1].completed).toBe(true);
    
    // Проверяем, что остальные задачи не выполнены
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[2].completed).toBe(false);
    
    // Проверяем статистику перед очисткой
    const statsBefore = result.current.getStats();
    expect(statsBefore.completed).toBe(1);
    
    act(() => {
      result.current.clearCompleted();
    });
    
    expect(result.current.todos).toHaveLength(2);
    expect(result.current.todos.every(todo => !todo.completed)).toBe(true);
  });

  it('calculates stats correctly', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Задача 1');
    });
    
    act(() => {
      result.current.addTodo('Задача 2');
    });
    
    act(() => {
      result.current.addTodo('Задача 3');
    });
    
    // Проверяем, что у нас 3 задачи
    expect(result.current.todos).toHaveLength(3);
    
    // Отмечаем первую задачу как выполненную
    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
    });
    
    // Проверяем, что задача отмечена как выполненная
    expect(result.current.todos[0].completed).toBe(true);
    
    // Проверяем, что остальные задачи не выполнены
    expect(result.current.todos[1].completed).toBe(false);
    expect(result.current.todos[2].completed).toBe(false);
    
    const stats = result.current.getStats();
    
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.remaining).toBe(2);
  });

  it('filters active and completed todos correctly', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Активная задача 1');
    });
    
    act(() => {
      result.current.addTodo('Активная задача 2');
    });
    
    act(() => {
      result.current.addTodo('Выполненная задача');
    });
    
    // Проверяем, что у нас 3 задачи
    expect(result.current.todos).toHaveLength(3);
    
    // Порядок: [0] = "Выполненная задача", [1] = "Активная задача 2", [2] = "Активная задача 1"
    expect(result.current.todos[0].text).toBe('Выполненная задача');
    expect(result.current.todos[1].text).toBe('Активная задача 2');
    expect(result.current.todos[2].text).toBe('Активная задача 1');
    
    // Проверяем, что все задачи изначально не выполнены
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[1].completed).toBe(false);
    expect(result.current.todos[2].completed).toBe(false);
    
    // Отмечаем третью задачу как выполненную (индекс 2)
    const completedTodoId = result.current.todos[2].id;
    act(() => {
      result.current.toggleTodo(completedTodoId);
    });
    
    // Проверяем, что задача отмечена как выполненная
    expect(result.current.todos[2].completed).toBe(true);
    
    // Проверяем, что остальные задачи не выполнены
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[1].completed).toBe(false);
    
    const activeTodos = result.current.getActiveTodos();
    const completedTodos = result.current.getCompletedTodos();
    
    expect(activeTodos).toHaveLength(2);
    expect(completedTodos).toHaveLength(1);
    expect(activeTodos.every(todo => !todo.completed)).toBe(true);
    expect(completedTodos.every(todo => todo.completed)).toBe(true);
  });

  it('loads todos from localStorage on initialization', () => {
    const savedTodos = [
      {
        id: '1',
        text: 'Сохраненная задача',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedTodos));
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Сохраненная задача');
  });

  it('saves todos to localStorage when todos change', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Тестовая задача');
    });
    
    // Проверяем, что localStorage был вызван
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'mindbox-todos',
      expect.any(String)
    );
    
    // Получаем данные из последнего вызова setItem
    const lastCall = localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1];
    const savedData = JSON.parse(lastCall[1]);
    expect(savedData).toHaveLength(1);
    expect(savedData[0].text).toBe('Тестовая задача');
  });
});
