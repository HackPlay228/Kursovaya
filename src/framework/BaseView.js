// Базовый класс для всех View
export class BaseView {
    constructor(element) {
        this.element = element;
        this.handlers = new Map();
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    on(event, selector, handler) {
        if (this.element) {
            this.element.addEventListener(event, (e) => {
                if (e.target.matches(selector)) {
                    handler(e);
                }
            });
        }
    }

    bind(event, handler) {
        this.handlers.set(event, handler);
    }

    emit(event, data) {
        const handler = this.handlers.get(event);
        if (handler) {
            handler(data);
        }
    }
}