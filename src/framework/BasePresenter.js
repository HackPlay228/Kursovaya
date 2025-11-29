export class BasePresenter {
    constructor() {
        this.handlers = new Map();
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