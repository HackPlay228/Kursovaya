import { BaseView } from '../framework/BaseView.js';

export class Modal extends BaseView {
    constructor(elementId) {
        super(document.getElementById(elementId));
        this.bindEvents();
    }

    bindEvents() {
        // Закрытие по клику на крестик
        this.on('click', '.close', () => this.hide());
        
        // Закрытие по клику вне модального окна
        if (this.element) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) this.hide();
            });
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.element && this.element.style.display === 'block') {
                this.hide();
            }
        });
    }

    setTitle(title) {
        const titleElement = this.element.querySelector('.modal-title');
        if (titleElement) titleElement.textContent = title;
    }

    setContent(content) {
        const contentElement = this.element.querySelector('.modal-content');
        if (contentElement) contentElement.innerHTML = content;
    }

    show() {
        super.show();
        document.body.style.overflow = 'hidden';
    }

    hide() {
        super.hide();
        document.body.style.overflow = 'auto';
        this.emit('close');
    }
}