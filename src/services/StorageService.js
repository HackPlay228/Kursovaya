export class StorageService {
    constructor(key) {
        this.key = key;
    }

    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}