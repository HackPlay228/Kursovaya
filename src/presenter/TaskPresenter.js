import { TaskManager } from '../model/TaskManager.js';
import { TaskView } from '../view/TaskView.js';
import { ModalView } from '../view/ModalView.js';

export class TaskPresenter {
    constructor() {
        this.taskManager = new TaskManager();
        this.taskView = new TaskView(this);
        this.modalView = new ModalView(this);
        
        this.init();
    }

    init() {
        this.taskView.bindEvents();
        this.modalView.bindEvents();
        this.loadMockData();
    }

    // Методы для TaskView
    getTasks() {
        return this.taskManager.getAllTasks();
    }

    getTasksByStatus(status) {
        return this.taskManager.getTasksByStatus(status);
    }

    getSortedTasks(status) {
        return this.taskManager.getSortedTasks(status);
    }

    toggleSubtask(taskId, subtaskIndex) {
        this.taskManager.toggleSubtask(taskId, subtaskIndex);
        this.taskView.render();
    }

    toggleTaskCollapse(taskId) {
        this.taskManager.toggleTaskCollapse(taskId);
        this.taskView.render();
    }

    deleteTask(taskId) {
        this.taskManager.deleteTask(taskId);
        this.taskView.render();
    }

    editTask(taskId) {
        const task = this.taskManager.getTask(taskId);
        if (task) {
            this.modalView.show(task);
        }
    }

    toggleAllTasks() {
        const allTasks = this.taskManager.getAllTasks();
        const allCollapsed = allTasks.length > 0 && allTasks.every(task => task.isCollapsed);
        this.taskManager.toggleAllCollapsed(!allCollapsed);
        this.taskView.render();
    }

    // Методы для ModalView
    showModal() {
        this.modalView.show();
    }

    createTask(data) {
        this.taskManager.addTask(
            data.title,
            data.description,
            data.subtasks,
            data.deadline,
            data.priority
        );
        this.taskView.render();
    }

    updateTask(taskId, data) {
        this.taskManager.updateTask(
            taskId,
            data.title,
            data.description,
            data.subtasks,
            data.deadline,
            data.priority
        );
        this.taskView.render();
    }

    loadMockData() {
        const mockTasks = [
            {
                title: 'Изучить JavaScript',
                description: 'Освоить продвинутые концепции JavaScript',
                subtasks: ['Изучить замыкания', 'Разобраться с промисами', 'Понять async/await', 'Изучить ES6+'],
                deadline: '2024-02-15',
                priority: 'high'
            },
            {
                title: 'Подготовиться к экзамену по математике',
                description: 'Повторить основные темы за семестр',
                subtasks: ['Повторить линейную алгебру', 'Решить задачи по матанализу', 'Сделать практические задания'],
                deadline: '2024-02-20',
                priority: 'medium'
            }
        ];

        mockTasks.forEach(taskData => {
            this.taskManager.addTask(
                taskData.title,
                taskData.description,
                taskData.subtasks,
                taskData.deadline,
                taskData.priority
            );
        });

        // Отмечаем некоторые подзадачи для демо
        const tasks = this.taskManager.getAllTasks();
        if (tasks.length > 0) {
            this.taskManager.toggleSubtask(tasks[0].id, 0);
            this.taskManager.toggleSubtask(tasks[0].id, 1);
        }

        this.taskView.render();
    }
}