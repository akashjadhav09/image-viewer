import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdCheck, MdOutlineClear  } from "react-icons/md";

import './TodoListCss.css'

export default function Todo (){

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [completedTask, setCompletedTask] = useState([]);

    const handleNewTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, newTask]); 
            setNewTask(""); 
        }
    }

    const handleRemovedTask = (indexToRemove) => {
        const updatedTasks = tasks.filter((_, index) => index !== indexToRemove);
        setTasks(updatedTasks);
    }

    const handleCompletedTask = (indexToRemove) => {
        const taskToComplete = tasks[indexToRemove];
        setCompletedTask([...completedTask, taskToComplete]);
        const updatedTasks = tasks.filter((_, index) => index !== indexToRemove);
        setTasks(updatedTasks);
    }

    const handleRemovedCompletedTask = (indexToRemove) => {
        const updatedTasks = completedTask.filter((_, index) => index !== indexToRemove);
        setCompletedTask(updatedTasks);
    }

    return(
        <div className="todo-wrapper-outer">
            <div className="todo-wrapper-inner">
            <input
            className="task-textbox"
            type="text"
            placeholder="Enter Task Here"
            value={newTask} 
            onChange={(event) => setNewTask(event.target.value)} 
            />
                <button className="add-task-btn" onClick={handleNewTask}><MdAdd /></button>
            </div>

            {tasks && (                
                <div className="todo-task-container">
                     <p>Task To-Do</p>
                    <ul>
                        {tasks.map((currentTask, index)=> (
                            <li key={index}>
                                <div className="task-wrapper-outer">
                                    <div className="task-wrapper-inner">{currentTask}</div>
                                    <div className="delete-btn-wrapper">
                                        <MdDeleteOutline className="delete-btn" onClick={()=> handleRemovedTask(index)}/>
                                        <MdCheck className="check-btn" onClick={()=> handleCompletedTask(index)}/>
                                    </div>
                                    
                                </div>                                
                            </li>
                        ))}
                    </ul>
                </div>
            ) }


            {completedTask && (                
                <div className="completed-task-container">
                    <p>Completed Task</p>
                    <ul>
                        {completedTask.map((currentTask, index)=> (
                            <li key={index} className="completed-task-wrapper">
                                <div className="task-wrapper-outer">
                                    <div className="completed-task">{currentTask}</div>
                                    <MdOutlineClear  className="delete-btn complete-delete-task-btn" onClick={()=> handleRemovedCompletedTask(index)}/>
                                </div>                                
                            </li>
                        ))}
                    </ul>
                </div>
            ) } 
        </div>
    )
}