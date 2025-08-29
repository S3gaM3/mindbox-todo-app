import React, { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="input-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todo-input"
          placeholder="Введите новую задачу..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="add-button"
          disabled={!text.trim()}
        >
          Добавить задачу
        </button>
      </form>
    </div>
  );
};
