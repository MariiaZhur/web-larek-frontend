import { EventSubscription, EventTrigger } from '../components/base/events';

// == Базовые alias'ы ==
export type UUID = string;
export type Url = string;
export type Email = string;
export type PhoneNumber = string;
export type Price = number;
export type ProductIDs = UUID[];

// интерфейс продукта / товара
export interface IProduct {
	id: UUID;
	title: string;
	description: string;
	price: Price | null;
	image: Url;
	category: string;
}

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

// == Модель корзины ==
export interface IBasket {
	products: IProduct[]; // Список товаров в корзине
	total: Price;
	addProduct(product: IProduct): void; // Добавить товар
	removeProduct(product: IProduct): void; // Удалить товар по ID
	clear(): void; // Очистить корзину
	getCount(): number; // Получить количество товаров
}

// == Перечисления ==
export enum PaymentMethod {
	Online = 'online',
	Cash = 'cash',
}

//интерфейс информации о данных для связи
export interface ICustomerInfo {
	email: Email;
	phone: PhoneNumber;
}

//интерфейс информации о доставке (адресс)
export interface IShippingAndPaymentInfo {
	address: string;
	paymentMethod: PaymentMethod; // Метод оплаты
}

// интерфейс для оформления заказа
export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[]; // product ids
}

// интерфейс ответа от сервера при оформлении заказа
export interface ISubmissionOrderResult {
	id: UUID;
	total: Price;
}

// ошибка формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum AppEvent {
	ProductShowDetails = 'product:showDetails',

	BasketAddProduct = 'basket:addProduct',
	BasketRemoveProduct = 'basket:removeProduct',
	BasketShow = 'basket:show',
	BasketRefreshView = 'basket:refreshView',

	OrderShow = 'order:show',
	OrderSubmit = 'order:submit',
	OrderShowSubmissionResult = 'order:showSubmissionResult',
}

export type ProductShowDetailsEventTrigger = EventTrigger<IProduct>;
export type ProductShowDetailsEventSubscription = EventSubscription<IProduct>;

export type ProductAddToBusketEventTrigger = EventTrigger<IProduct>;
export type ProductAddToBusketEventSubscription = EventSubscription<IProduct>;

export type BasketRefreshViewEventTrigger = EventTrigger<IBasket>;
export type BasketRefreshViewEventSubscription = EventSubscription<IBasket>;

export type BasketShowEventTrigger = EventTrigger<IBasket>;
export type BasketShowEventSubscription = EventSubscription<IBasket>;

export type OrderShowEventTrigger = EventTrigger<IBasket>;
export type OrderShowEventSubscription = EventSubscription<IBasket>;

export type OrderSubmitEventTrigger = EventTrigger<IOrder>;
export type OrderSubmitEventSubscriptiion = EventSubscription<IOrder>;

export type SubmissionOrderResultShowEventTrigger =
	EventTrigger<ISubmissionOrderResult>;
export type SubmissionOrderResultShowEventSubscription =
	EventSubscription<ISubmissionOrderResult>;
