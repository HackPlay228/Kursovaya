import { TaskManager } from '../model/TaskManager.js';
import { TaskView } from '../view/TaskView.js';
import { ModalView } from '../view/ModalView.js';
import { MockApiService } from '../services/MockApiService.js';

export class TaskPresenter {
    constructor() {
        this.taskManager = new TaskManager();
        this.taskView = new TaskView(this);
        this.modalView = new ModalView(this);
        this.apiService = new MockApiService();
        
        this.init();
    }

    async init() {
        this.showLoading('Инициализация приложения...');
        
        this.taskView.bindEvents();
        this.modalView.bindEvents();
        
        await this.loadTasks();
        
        this.hideLoading();
    }

    showLoading(message = 'Загрузка...') {
        const loadingEl = document.getElementById('loading');
        const statusEl = document.getElementById('apiStatus');
        
        if (loadingEl && statusEl) {
            loadingEl.style.display = 'flex';
            statusEl.textContent = `Статус: ${message}`;
        }
    }

    hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            setTimeout(() => {
                loadingEl.style.display = 'none';
            }, 500);
        }
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

    async toggleSubtask(taskId, subtaskIndex) {
        this.showLoading('Обновление подзадачи...');
        
        try {
            await this.apiService.toggleSubtask(taskId, subtaskIndex);
            await this.loadTasks();
        } catch (error) {
            console.error('Error toggling subtask:', error);
            this.taskManager.toggleSubtask(taskId, subtaskIndex);
            this.taskView.render();
        } finally {
            this.hideLoading();
        }
    }

    toggleTaskCollapse(taskId) {
        this.taskManager.toggleTaskCollapse(taskId);
        this.taskView.render();
    }

    async deleteTask(taskId) {
        if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
        
        this.showLoading('Удаление задачи...');
        
        try {
            await this.apiService.deleteTask(taskId);
            await this.loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            this.taskManager.deleteTask(taskId);
            this.taskView.render();
            alert('Ошибка удаления на сервере, задача удалена локально');
        } finally {
            this.hideLoading();
        }
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

    async createTask(data) {
        this.showLoading('Создание задачи...');
        
        try {
            const taskData = {
                title: data.title,
                description: data.description || '',
                subtasks: data.subtasks.map(text => ({ text, completed: false })),
                deadline: data.deadline,
                priority: data.priority,
                status: 'backlog',
                isCollapsed: false,
                createdAt: new Date().toISOString()
            };
            
            await this.apiService.createTask(taskData);
            await this.loadTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Ошибка при создании задачи. Проверьте консоль.');
        } finally {
            this.hideLoading();
        }
    }

    async updateTask(taskId, data) {
        this.showLoading('Обновление задачи...');
        
        try {
            const existingTask = this.taskManager.getTask(taskId);
            const taskData = {
                title: data.title,
                description: data.description || '',
                subtasks: data.subtasks.map(text => {
                    if (existingTask) {
                        const existingSubtask = existingTask.subtasks.find(st => st.text === text);
                        return { 
                            text, 
                            completed: existingSubtask ? existingSubtask.completed : false 
                        };
                    }
                    return { text, completed: false };
                }),
                deadline: data.deadline,
                priority: data.priority,
                status: existingTask ? existingTask.status : 'backlog',
                isCollapsed: existingTask ? existingTask.isCollapsed : false,
                createdAt: existingTask ? existingTask.createdAt : new Date().toISOString()
            };
            
            await this.apiService.updateTask(taskId, taskData);
            await this.loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Ошибка при обновлении задачи');
        } finally {
            this.hideLoading();
        }
    }

    async loadTasks() {
        this.showLoading('Загрузка задач с MockAPI...');
        
        try {
            const tasks = await this.apiService.getAllTasks();
            
            // Очищаем текущие задачи
            this.taskManager = new TaskManager();
            
            // Загружаем новые задачи из API
            if (tasks && Array.isArray(tasks)) {
                tasks.forEach(task => {
                    this.taskManager.addTaskFromApi(task);
                });
                console.log(`✅ Загружено ${tasks.length} задач с MockAPI`);
            } else {
                console.warn('⚠️ Нет данных от MockAPI, использую локальные');
                this.loadLocalData();
            }
            
            this.taskView.render();
        } catch (error) {
            console.error('❌ Ошибка загрузки задач с MockAPI:', error);
            this.loadLocalData();
        } finally {
            this.hideLoading();
        }
    }

    loadLocalData() {
        console.log('📂 Загружаю локальные данные...');
        
        const localTasks = [
            {
                id: 'local-1',
                title: 'Локальная задача 1',
                description: 'Эта задача загружена локально',
                subtasks: [
                    { text: 'Первая подзадача', completed: true },
                    { text: 'Вторая подзадача', completed: false }
                ],
                deadline: '2024-02-28',
                priority: 'medium',
                status: 'progress',
                isCollapsed: false
            },
            {
                id: 'local-2',
                title: 'Локальная задача 2',
                description: 'MockAPI недоступен',
                subtasks: [
                    { text: 'Проверить подключение', completed: false }
                ],
                deadline: '2024-03-01',
                priority: 'high',
                status: 'backlog',
                isCollapsed: false
            }
        ];
        
        this.taskManager = new TaskManager();
        localTasks.forEach(task => {
            this.taskManager.addTaskFromApi(task);
        });
        
        this.taskView.render();
    }
}