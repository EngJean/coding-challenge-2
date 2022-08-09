import React, { useState, useEffect, useRef } from 'react';

function TaskForm(props) {
    const [input, setInput] = useState(props.edit ? props.edit.value : '');

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    });

    const handleChange = e => {
        setInput(e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();
        props.onSubmit({
            id: Math.floor(Math.random() * 1000000),
            text: input,
        });
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className='task-form'> 
        {props.edit ? (
            <>
                <input
                    placeholder="Enter a new name for your task here..."
                    value={input}
                    onChange={handleChange}
                    name='text'
                    ref={inputRef}
                    className='task-input edit' 
                />
                <button onClick={handleSubmit} className='task-button edit'>
                    Edit
                </button>
            </>
            ) : (
            <>
                <input
                    placeholder="Task Name"
                    value={input}
                    onChange={handleChange}
                    name='text'
                    className='task-input'
                    ref={inputRef} 
                />
                <button onClick={handleSubmit} className='task-button add'>
                    Add
                </button>
            </>
            )}
        </form>
    );
}

export default TaskForm;