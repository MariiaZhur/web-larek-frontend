
// == Базовые alias'ы ==
export type UUID = string;
export type Url = string;
export type Email = string;
export type PhoneNumber = string;
export type Price = number;

// интерфейс продукта / товара
export interface IProduct {
  id: UUID;
  title: string;
  description: string;
  price: Price;
  image: Url;
  categories: string[];
}

// == Модель корзины ==
export interface IBasket {
  products: IProduct[]; // Список товаров в корзине
  addProduct(product: IProduct): void; // Добавить товар
  removeProduct(productId: UUID): void; // Удалить товар по ID
  clear(): void; // Очистить корзину
  getTotal(): Price; // Получить общую стоимость
  getCount(): number; // Получить количество товаров
  getProducts(): IProduct[]; // Получить копию списка товаров
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
  products: IProduct[]; // Товары в заказе
  shippingAndPaymentInfo: IShippingAndPaymentInfo; // Информация о доставке
  customerInfo: ICustomerInfo; // Информация о клиенте
}

// интерфейс ответа от сервера при оформлении заказа
export interface ISubmissionOrderResult {
  orderId: UUID;
  message: string;
  totalAmount: Price;
}

// Тип функции обработчика событий создаваемого функцией EvenntEmitter.trigger
export type EventTrigger<T = unknown> = (event?: object) => void;
// в дальнейшем будет перенесено
export function onEvent<T>(emitter: EventEmitter, eventName: string) {
  return (callback: (data: T) => void) => {
    emitter.on(eventName, callback);
  };
}

export type EventSubscription<T> = (callback: (data: T) => void) => void;
