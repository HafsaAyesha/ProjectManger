import React from 'react';
import '../../styles/kanban.css'; 

const KanbanNavbar = ({ onAddTask }) => {
  return (
    <nav className="kanban-navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'var(--color-strong)',
      color: 'white',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Kanban Board
      </div>
      <div>
        <button 
          className="btn btn-primary" 
          style={{ 
            backgroundColor: 'var(--color-accent)', 
            border: 'none',
            color: 'white',
            fontWeight: 'bold'
          }}
          onClick={onAddTask}
        >
          + Add Task
        </button>
      </div>
    </nav>
  );
};

export default KanbanNavbar;
