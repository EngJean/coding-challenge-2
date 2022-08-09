import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { RiCheckboxBlankLine, RiCheckboxLine, RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Task = ({ tasks, completeTask, removeTask, editTask }) => {
    const [edit, setEdit] = useState({
        id: null,
        value: ''
    });

    const submitEdit = value => {
        editTask(edit.id, value);
        setEdit({
            id: null,
            value: ''
        });
    };

    if (edit.id) {
        return <TaskForm edit={edit} onSubmit={submitEdit} />;
    }

    return tasks.map((task, index) => (
        <div className={task.isComplete ? 'task-row complete' : 'task-row'}
        key={index}>

            <div className= 'task-container-text' key={task.id}>
                {task.text} 
            </div>

            <div className='task-container-icons'>    
                <RiCheckboxBlankLine  
                    onClick={() => completeTask(task.id)}
                    className='task-checkbox-icon' />

                <RiCloseCircleLine
                onClick={() => removeTask(task.id)}
                className='task-delete-icon' />

                <TiEdit
                onClick={() => setEdit({ id: task.id, value: task.text })}
                className='task-edit-icon' />
            </div>    
        </div>
    ));
};

export default Task;