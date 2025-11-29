import { Task } from './Task.js';
import { TASK_STATUS, PRIORITY_ORDER } from '../const.js';

export class TaskManager {
    constructor() {
        this.tasks = new Map();
    }

    addTask(title, description, subtasks, deadline, priority) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const task = new Task(id, title, description, subtasks, deadline, priority);
        this.tasks.set(id, task);
        return task;
    }

    updateTask(id, title, description, subtasks, deadline, priority) {
        const task = this.tasks.get(id);
        if (task) {
            task.title = title;
            task.description = description;
            task.subtasks = subtasks.map(text => {
                const existingSubtask = task.subtasks.find(st => st.text === text);
                return { 
                    text, 
                    completed: existingSubtask ? existingSubtask.completed : false 
                };
            });
            task.deadline = deadline;
            task.priority = priority;
            task.updateStatus();
            return true;
        }
        return false;
    }

    deleteTask(id) {
        return this.tasks.delete(id);
    }

    getTask(id) {
        return this.tasks.get(id);
    }

    getAllTasks() {
        return Array.from(this.tasks.values());
    }

    getTasksByStatus(status) {
        return this.getAllTasks().filter(task => task.status === status);
    }

    getSortedTasks(status) {
        const tasks = this.getTasksByStatus(status);
        return tasks.sort((a, b) => {
            if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
                return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
            }
            return new Date(a.deadline) - new Date(b.deadline);
        });
    }

    toggleSubtask(taskId, subtaskIndex) {
        const task = this.tasks.get(taskId);
        return task ? task.toggleSubtask(subtaskIndex) : false;
    }

    toggleTaskCollapse(taskId) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.toggleCollapse();
            return true;
        }
        return false;
    }

    toggleAllCollapsed(isCollapsed) {
        this.getAllTasks().forEach(task => {
            task.isCollapsed = isCollapsed;
        });
    }
}