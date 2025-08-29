import React from 'react';
import { TodoStats } from '../types';

interface StatsProps {
  stats: TodoStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="stats">
      <span>Всего задач: {stats.total}</span>
      <span>Выполнено: {stats.completed}</span>
      <span>Осталось: {stats.remaining}</span>
    </div>
  );
};
