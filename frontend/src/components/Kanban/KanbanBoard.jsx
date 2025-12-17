import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import '../../styles/kanban.css';

const KanbanBoard = ({ tasks, onAddTaskClick, onDragEnd }) => {
    const columns = [
        { title: 'Backlog', status: 'backlog' },
        { title: 'To Do', status: 'todo' },
        { title: 'In Progress', status: 'inprogress' },
        { title: 'Review', status: 'review' },
        { title: 'Done', status: 'done' }
    ];

    // Group tasks by status for rendering
    const tasksByStatus = columns.reduce((acc, col) => {
        acc[col.status] = tasks.filter(t => t.status === col.status);
        return acc;
    }, {});

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
                {columns.map(col => (
                    <Droppable droppableId={col.status} key={col.status}>
                        {(provided) => (
                            <div
                                className="kanban-column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <KanbanColumn
                                    title={col.title}
                                    status={col.status}
                                    tasks={tasksByStatus[col.status]}
                                    onAddTask={onAddTaskClick}
                                >
                                    {tasksByStatus[col.status].map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {task.title ? <div>{task.title}</div> : null}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </KanbanColumn>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};


export default KanbanBoard;
