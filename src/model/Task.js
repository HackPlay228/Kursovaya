import { TASK_STATUS } from '../const.js';

export class Task {
    constructor(id, title, description, subtasks, deadline, priority) {
        this.id = id;
        this.title = title;
        this.description = description || '';
        this.subtasks = subtasks.map(text => ({ text, completed: false }));
        this.deadline = deadline;
        this.priority = priority;
        this.status = TASK_STATUS.BACKLOG;
        this.isCollapsed = false;
    }

    getProgress() {
        const completed = this.subtasks.filter(subtask => subtask.completed).length;
        return {
            completed,
            total: this.subtasks.length,
            percentage: this.subtasks.length > 0 ? (completed / this.subtasks.length) * 100 : 0
        };
    }

    updateStatus() {
        const progress = this.getProgress();
        
        if (progress.percentage === 100) {
            this.status = TASK_STATUS.COMPLETED;
        } else if (progress.completed > 0) {
            this.status = TASK_STATUS.PROGRESS;
        } else {
            this.status = TASK_STATUS.BACKLOG;
        }
    }

    toggleSubtask(index) {
        if (index >= 0 && index < this.subtasks.length) {
            this.subtasks[index].completed = !this.subtasks[index].completed;
            this.updateStatus();
            return true;
        }
        return false;
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
    }
}