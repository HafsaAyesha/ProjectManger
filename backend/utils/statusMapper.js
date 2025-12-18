// Status mapping between Dashboard and Kanban columns
const statusColumnMapping = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'inProgress': 'In Progress',
    'review': 'Review',
    'done': 'Done',
    'completed': 'Done'
};

const columnStatusMapping = {
    'To Do': 'todo',
    'In Progress': 'in-progress',
    'Review': 'review',
    'Done': 'done'
};

/**
 * Get Kanban column title from Dashboard status
 * @param {string} status - Dashboard status (todo, in-progress, done, etc.)
 * @returns {string} Kanban column title
 */
const getColumnFromStatus = (status) => {
    return statusColumnMapping[status] || 'To Do';
};

/**
 * Get Dashboard status from Kanban column title
 * @param {string} columnTitle - Kanban column title (To Do, In Progress, etc.)
 * @returns {string} Dashboard status
 */
const getStatusFromColumn = (columnTitle) => {
    return columnStatusMapping[columnTitle] || 'todo';
};

/**
 * Normalize status string for consistent comparison
 * @param {string} status - Status string to normalize
 * @returns {string} Normalized status
 */
const normalizeStatus = (status) => {
    if (!status) return 'todo';
    const lower = status.toLowerCase().replace(/[_\s]/g, '-');
    return statusColumnMapping[lower] ? getStatusFromColumn(statusColumnMapping[lower]) : 'todo';
};

module.exports = {
    statusColumnMapping,
    columnStatusMapping,
    getColumnFromStatus,
    getStatusFromColumn,
    normalizeStatus
};
