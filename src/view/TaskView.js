import { PRIORITY_LABELS, TASK_STATUS, PRIORITY_COLORS } from '../const.js';

export class TaskView {
    constructor(presenter) {
        this.presenter = presenter;
        this.boards = {
            [TASK_STATUS.BACKLOG]: document.getElementById('backlog-tasks'),
            [TASK_STATUS.PROGRESS]: document.getElementById('progress-tasks'),
            [TASK_STATUS.COMPLETED]: document.getElementById('completed-tasks')
        };
    }

    bindEvents() {
        // Кнопки управления
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.presenter.showModal();
        });

        document.getElementById('toggleAllBtn').addEventListener('click', () => {
            this.presenter.toggleAllTasks();
        });

        // Делегирование событий для задач
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.classList.contains('delete')) {
                const taskId = target.closest('.goal').dataset.taskId;
                if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                    this.presenter.deleteTask(taskId);
                }
            } 
            else if (target.classList.contains('edit')) {
                const taskId = target.closest('.goal').dataset.taskId;
                this.presenter.editTask(taskId);
            }
            else if (target.classList.contains('collapse')) {
                const taskId = target.closest('.goal').dataset.taskId;
                this.presenter.toggleTaskCollapse(taskId);
            }
        });

        // Чекбоксы подзадач
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.taskId) {
                const taskId = e.target.dataset.taskId;
                const subtaskIndex = parseInt(e.target.dataset.subtaskIndex);
                this.presenter.toggleSubtask(taskId, subtaskIndex);
            }
        });
    }

    render() {
        // Очищаем доски
        Object.values(this.boards).forEach(board => {
            if (board) board.innerHTML = '';
        });

        // Рендерим задачи по статусам
        Object.values(TASK_STATUS).forEach(status => {
            const tasks = this.presenter.getSortedTasks(status);
            tasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                if (this.boards[status]) {
                    this.boards[status].appendChild(taskElement);
                }
            });
        });
    }

    createTaskElement(task) {
        const progress = task.getProgress();
        const isOverdue = new Date(task.deadline) < new Date();

        const taskElement = document.createElement('div');
        taskElement.className = `goal ${task.isCollapsed ? 'collapsed' : ''} ${task.status === 'completed' ? 'done' : ''}`;
        taskElement.dataset.taskId = task.id;

        taskElement.innerHTML = `
            <div class="progress">
                <i style="width: ${progress.percentage}%"></i>
            </div>
            <div class="goal-header">
                <div class="goal-main">
                    <div class="goal-name">${this.escapeHtml(task.title)}</div>
                    <div class="goal-meta">
                        <span class="priority" style="background: ${PRIORITY_COLORS[task.priority]}; color: ${task.priority === 'urgent' || task.priority === 'high' ? '#fff' : '#000'}">
                            ${PRIORITY_LABELS[task.priority]}
                        </span>
                        <span class="deadline ${isOverdue ? 'overdue' : ''}">
                            📅 ${new Date(task.deadline).toLocaleDateString('ru-RU')}
                        </span>
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="icon-btn collapse" data-task-id="${task.id}">
                        ${task.isCollapsed ? '🔽' : '🔼'}
                    </button>
                    <button class="icon-btn edit" data-task-id="${task.id}">✏️</button>
                    <button class="icon-btn delete" data-task-id="${task.id}">🗑️</button>
                </div>
            </div>
            <div class="goal-content">
                ${task.description ? `<div class="goal-desc">${this.escapeHtml(task.description)}</div>` : ''}
                
                <ul class="checkpoints">
                    ${task.subtasks.map((subtask, index) => `
                        <li>
                            <input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                                   data-task-id="${task.id}" data-subtask-index="${index}">
                            <span class="${subtask.completed ? 'completed' : ''}">${this.escapeHtml(subtask.text)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        return taskElement;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}