// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
// alias
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export type EventTrigger<T = object> = (data: T) => void;

export type EventSubscription<T> = (callback: (data: T) => void) => void;

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	off(event: EventName, callback: Subscriber): void;
	// emit<T extends object>(event: string, data?: T): void;
	onAll(callback: (event: EmitterEvent) => void): void;
	offAll(): void;
	createTrigger<T extends object>(
		event: string,
		context?: Partial<T>
	): EventTrigger<T>;
	createSubscription<T extends object>(event: EventName): EventSubscription<T>;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
	private _events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	/**
	 * Установить обработчик на событие
	 */
	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	/**
	 * Снять обработчик с события
	 */
	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	/**
	 * Инициировать событие с данными
	 */
	private emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (name === '*')
				subscribers.forEach((callback) =>
					callback({
						eventName,
						data,
					})
				);
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	/**
	 * Слушать все события
	 */
	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	/**
	 * Сбросить все обработчики
	 */
	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	/**
	 * Создаем триггер для события
	 */
	createTrigger<T extends object>(eventName: string): EventTrigger<T> {
		return (data: T) => this.emit(eventName, data);
	}

	/**
	 * Создаем подписку на событие
	 */
	createSubscription<T extends object>(
		eventName: EventName
	): EventSubscription<T> {
		return (callback: (data: T) => void) => {
			this.on(eventName, callback);
		};
	}
}
