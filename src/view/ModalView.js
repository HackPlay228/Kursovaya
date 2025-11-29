export class ModalView {
    constructor(presenter) {
        this.presenter = presenter;
        this.modal = document.getElementById('taskModal');
        this.form = document.getElementById('taskForm');
        this.subtasksContainer = document.getElementById('subtasksContainer');
        this.currentTask = null;
    }

    bindEvents() {
        // Кнопки модального окна
        document.getElementById('cancelBtn').addEventListener('click', () => this.hide());
        document.getElementById('addSubtaskBtn').addEventListener('click', () => this.addSubtaskInput());

        // Форма
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Клик вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    show(task = null) {
        this.currentTask = task;
        this.modal.style.display = 'flex';

        if (task) {
            this.fillForm(task);
        } else {
            this.clearForm();
        }
    }

    hide() {
        this.modal.style.display = 'none';
        this.currentTask = null;
    }

    fillForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDeadline').value = task.deadline;
        document.getElementById('taskPriority').value = task.priority;
        
        this.subtasksContainer.innerHTML = '';
        task.subtasks.forEach(subtask => {
            this.addSubtaskInput(subtask.text);
        });
    }

    clearForm() {
        this.form.reset();
        this.subtasksContainer.innerHTML = '';
        this.addSubtaskInput();
    }

    addSubtaskInput(value = '') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'modal-input subtask';
        input.placeholder = 'Подзадача';
        input.required = true;
        input.value = value;
        this.subtasksContainer.appendChild(input);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;
        
        const subtaskInputs = this.subtasksContainer.querySelectorAll('.subtask');
        const subtasks = Array.from(subtaskInputs)
            .map(input => input.value.trim())
            .filter(text => text !== '');

        if (!title || subtasks.length === 0 || !deadline) {
            alert('Заполните все обязательные поля!');
            return;
        }

        if (this.currentTask) {
            this.presenter.updateTask(this.currentTask.id, { title, description, subtasks, deadline, priority });
        } else {
            this.presenter.createTask({ title, description, subtasks, deadline, priority });
        }

        this.hide();
    }
}