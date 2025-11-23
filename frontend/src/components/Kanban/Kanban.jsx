import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Kanban.css";

const Kanban = ({ userId, email }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", body: "", status: "todo" });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/list/getTask/${userId}`);
      if (res.data.list) setTasks(res.data.list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleAddTask = async () => {
    if (!newTask.title || !newTask.body) return;
    try {
      await axios.post("/api/list/addTask", { ...newTask, email });
      setNewTask({ title: "", body: "", status: "todo" });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/list/updateTask/${taskId}`, { status, email });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/list/deleteTask/${taskId}`, { data: { email } });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter tasks by status
  const columns = {
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "inProgress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <div className="kanban-container">
      <h2>Kanban Board</h2>

      <div className="add-task">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task details"
          value={newTask.body}
          onChange={(e) => setNewTask({ ...newTask, body: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="kanban-board">
        {Object.keys(columns).map((col) => (
          <div className="kanban-column" key={col}>
            <h3>{col === "todo" ? "To Do" : col === "inProgress" ? "In Progress" : "Done"}</h3>
            {columns[col].map((task) => (
              <div className="kanban-card" key={task._id}>
                <h4>{task.title}</h4>
                <p>{task.body}</p>
                <div className="card-actions">
                  {col !== "todo" && (
                    <button onClick={() => updateTaskStatus(task._id, "todo")}>To Do</button>
                  )}
                  {col !== "inProgress" && (
                    <button onClick={() => updateTaskStatus(task._id, "inProgress")}>
                      In Progress
                    </button>
                  )}
                  {col !== "done" && (
                    <button onClick={() => updateTaskStatus(task._id, "done")}>Done</button>
                  )}
                  <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
