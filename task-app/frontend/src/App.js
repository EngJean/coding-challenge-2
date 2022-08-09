import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

export default function App() {
  return (
    <div className='task-app'>
      <TaskList />
    </div>
  );
}