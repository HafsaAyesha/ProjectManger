import { useState, useEffect } from "react";
import KanbanNavbar from './KanbanNavbar';
import KanbanBoard from './KanbanBoard';
import AddTaskModal from './AddTaskModal';
import { fetchTasks, createTask, updateTask } from '../../api/tasks';
import '../../styles/theme.css';
import '../../styles/kanban.css';

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
            const newTask = await createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
            alert("Failed to create task. Please try again.");
        }
    };

    // 🔹 Move handleDragEnd inside component
    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return; // dropped outside
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const updatedTasks = [...tasks];
        const movedTaskIndex = tasks.findIndex(t => t._id === draggableId);
        const movedTask = { ...tasks[movedTaskIndex] };

        // Remove from old position
        updatedTasks.splice(movedTaskIndex, 1);
        movedTask.status = destination.droppableId;
        // Insert at new position
        updatedTasks.splice(destination.index, 0, movedTask);

        setTasks(updatedTasks);

        // Optional: update backend
        try {
            await updateTask(draggableId, movedTask);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <KanbanNavbar onAddTask={() => openModal('todo')} />

            <div style={{ flexGrow: 1 }}>
                <KanbanBoard
                    tasks={tasks}
                    onAddTaskClick={openModal}
                    onDragEnd={handleDragEnd}
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
