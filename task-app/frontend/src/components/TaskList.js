import React, { useState } from 'react';
import TaskForm from './TaskForm';
import Task from './Task';

export function TaskList() {
    const [tasks, setTasks] = useState([]);

    const addTask = task => {
        if (!task.text || /^\s*$/.test(task.text)) {
            return;
        }
        const newTasks = [task, ...tasks];
        setTasks(newTasks);
        console.log(...tasks);
    };

    const editTask = (taskId, newValue) => {
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }
        setTasks(prev => prev.map(item => (item.id === taskId ? newValue : item)));
    };

    const removeTask = id => {
        const removedArr = [...tasks].filter(task => task.id !== id);
        setTasks(removedArr);
    };

    const completeTask = id => {
        let updatedTasks = tasks.map(task => {
            if (task.id === id) {
                task.isComplete = !task.isComplete;
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    return (
        <>
            <h1>John Doe's List of Tasks</h1>
            <TaskForm onSubmit={addTask} />
            <Task
                tasks={tasks}
                completeTask={completeTask}
                removeTask={removeTask}
                editTask={editTask}
            />
        </>
    );
}

export default TaskList;