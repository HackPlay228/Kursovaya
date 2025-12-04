export class MockApiService {
    constructor() {
        // Твой URL MockAPI
        this.baseUrl = 'https://690c7aa3a6d92d83e84deaec.mockapi.io';
        this.tasksEndpoint = `${this.baseUrl}/tasks`;
    }

    async getAllTasks() {
        try {
            console.log('📡 Загружаю задачи с MockAPI:', this.tasksEndpoint);
            const response = await fetch(this.tasksEndpoint);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Задачи загружены:', data.length, 'задач');
            return data;
        } catch (error) {
            console.error('❌ Ошибка загрузки задач:', error);
            console.log('🔄 Использую локальные данные...');
            return this.getMockData();
        }
    }

    async getTask(id) {
        try {
            const response = await fetch(`${this.tasksEndpoint}/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`❌ Ошибка загрузки задачи ${id}:`, error);
            throw error;
        }
    }

    async createTask(taskData) {
        try {
            console.log('📤 Отправляю новую задачу:', taskData);
            const response = await fetch(this.tasksEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
            }
            
            const createdTask = await response.json();
            console.log('✅ Задача создана:', createdTask);
            return createdTask;
        } catch (error) {
            console.error('❌ Ошибка создания задачи:', error);
            throw error;
        }
    }

    async updateTask(id, taskData) {
        try {
            console.log(`📝 Обновляю задачу ${id}:`, taskData);
            const response = await fetch(`${this.tasksEndpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
            }
            
            const updatedTask = await response.json();
            console.log('✅ Задача обновлена:', updatedTask);
            return updatedTask;
        } catch (error) {
            console.error(`❌ Ошибка обновления задачи ${id}:`, error);
            throw error;
        }
    }

    async deleteTask(id) {
        try {
            console.log(`🗑️ Удаляю задачу ${id}`);
            const response = await fetch(`${this.tasksEndpoint}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка ${response.status}: ${response.statusText}`);
            }
            
            console.log('✅ Задача удалена');
            return true;
        } catch (error) {
            console.error(`❌ Ошибка удаления задачи ${id}:`, error);
            throw error;
        }
    }

    async toggleSubtask(taskId, subtaskIndex) {
        try {
            console.log(`🔄 Изменяю подзадачу ${subtaskIndex} задачи ${taskId}`);
            
            // 1. Получаем задачу
            const task = await this.getTask(taskId);
            
            // 2. Обновляем подзадачу
            if (task.subtasks && task.subtasks[subtaskIndex]) {
                task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
                
                // 3. Обновляем статус задачи
                const completedCount = task.subtasks.filter(st => st.completed).length;
                const totalCount = task.subtasks.length;
                
                if (totalCount > 0) {
                    if (completedCount === totalCount) {
                        task.status = 'completed';
                    } else if (completedCount > 0) {
                        task.status = 'progress';
                    } else {
                        task.status = 'backlog';
                    }
                }
                
                // 4. Сохраняем изменения
                return await this.updateTask(taskId, task);
            }
            return task;
        } catch (error) {
            console.error('❌ Ошибка изменения подзадачи:', error);
            throw error;
        }
    }

    // Fallback данные при ошибке сети
    getMockData() {
        console.log('📂 Использую локальные mock данные');
        return [
            {
                id: '1',
                title: 'Изучить JavaScript',
                description: 'Освоить продвинутые концепции JavaScript',
                subtasks: [
                    { text: 'Изучить замыкания', completed: true },
                    { text: 'Разобраться с промисами', completed: true },
                    { text: 'Понять async/await', completed: false },
                    { text: 'Изучить ES6+', completed: false }
                ],
                deadline: '2024-02-15',
                priority: 'high',
                status: 'progress',
                isCollapsed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Подготовиться к экзамену по математике',
                description: 'Повторить основные темы за семестр',
                subtasks: [
                    { text: 'Повторить линейную алгебру', completed: false },
                    { text: 'Решить задачи по матанализу', completed: false },
                    { text: 'Сделать практические задания', completed: false }
                ],
                deadline: '2024-02-20',
                priority: 'medium',
                status: 'backlog',
                isCollapsed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Создать портфолио проект',
                description: 'Разработать веб-приложение для портфолио',
                subtasks: [
                    { text: 'Придумать идею', completed: true },
                    { text: 'Создать дизайн', completed: false },
                    { text: 'Написать код', completed: false }
                ],
                deadline: '2024-03-01',
                priority: 'low',
                status: 'progress',
                isCollapsed: false,
                createdAt: new Date().toISOString()
            }
        ];
    }
}