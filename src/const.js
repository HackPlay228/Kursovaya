export const PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium', 
    HIGH: 'high',
    URGENT: 'urgent'
};

export const PRIORITY_LABELS = {
    [PRIORITIES.LOW]: 'Низкий',
    [PRIORITIES.MEDIUM]: 'Средний',
    [PRIORITIES.HIGH]: 'Высокий',
    [PRIORITIES.URGENT]: 'Срочный'
};

export const PRIORITY_ORDER = {
    [PRIORITIES.URGENT]: 4,
    [PRIORITIES.HIGH]: 3,
    [PRIORITIES.MEDIUM]: 2,
    [PRIORITIES.LOW]: 1
};

export const TASK_STATUS = {
    BACKLOG: 'backlog',
    PROGRESS: 'progress',
    COMPLETED: 'completed'
};

export const STATUS_LABELS = {
    [TASK_STATUS.BACKLOG]: 'Бэклог',
    [TASK_STATUS.PROGRESS]: 'В работе',
    [TASK_STATUS.COMPLETED]: 'Завершено'
};

export const PRIORITY_COLORS = {
    [PRIORITIES.LOW]: '#60a5fa',
    [PRIORITIES.MEDIUM]: '#6ee7b7',
    [PRIORITIES.HIGH]: '#ef4444',
    [PRIORITIES.URGENT]: '#b83280'
};