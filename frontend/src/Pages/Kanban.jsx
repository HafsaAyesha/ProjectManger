import { useState, useEffect } from "react";

import KanbanNavbar from '../components/Kanban/KanbanNavbar';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import AddTaskModal from '../components/Kanban/AddTaskModal';
import { fetchTasks, createTask } from '../api/tasks';
import '../styles/theme.css';

const Kanban = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialStatus, setModalInitialStatus] = useState('backlog');

    // Fetch tasks on mount
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await fetchTasks();
        if (Array.isArray(data)) {
            setTasks(data);
        } else {
            console.error("Fetched tasks data is not an array:", data);
            setTasks([]);
        }
    };

    const openModal = (status = 'backlog') => {
        setModalInitialStatus(status);
        setIsModalOpen(true);
    };

    const handleCreateTask = async (taskData) => {
        try {
            // Optimistic update or wait for server
            // For now, we'll wait for server response to be safe
            const newTask = await createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Failed to create task. Please try again.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <KanbanNavbar onAddTask={() => openModal('todo')} />

            <div style={{ flexGrow: 1 }}>
                <KanbanBoard
                    tasks={tasks}
                    onAddTaskClick={openModal}
                />
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateTask}
                initialStatus={modalInitialStatus}
            />
        </div>
    );
};

export default Kanban;
