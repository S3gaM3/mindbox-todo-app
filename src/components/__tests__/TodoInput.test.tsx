import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  it('renders input field and button', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    expect(screen.getByPlaceholderText('Введите новую задачу...')).toBeInTheDocument();
    expect(screen.getByText('Добавить задачу')).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with valid text', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Введите новую задачу...');
    const button = screen.getByText('Добавить задачу');
    
    fireEvent.change(input, { target: { value: 'Новая задача' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('Новая задача');
  });

  it('calls onAdd when Enter key is pressed', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Введите новую задачу...');
    
    fireEvent.change(input, { target: { value: 'Новая задача' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnAdd).toHaveBeenCalledWith('Новая задача');
  });

  it('does not call onAdd with empty text', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const button = screen.getByText('Добавить задачу');
    
    fireEvent.click(button);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd with whitespace-only text', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Введите новую задачу...');
    const button = screen.getByText('Добавить задачу');
    
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('clears input after adding todo', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Введите новую задачу...');
    const button = screen.getByText('Добавить задачу');
    
    fireEvent.change(input, { target: { value: 'Новая задача' } });
    fireEvent.click(button);
    
    expect(input).toHaveValue('');
  });

  it('trims whitespace from input text', () => {
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Введите новую задачу...');
    const button = screen.getByText('Добавить задачу');
    
    fireEvent.change(input, { target: { value: '  Новая задача  ' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('Новая задача');
  });
});
