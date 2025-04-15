// == Базовые alias'ы ==
export type UUID = string;
export type Url = string;
export type Email = string;
export type PhoneNumber = string;
export type Price = number;

// == Перечисления ==
export enum PaymentMethod {
  Online = 'online',
  Cash = 'cash',
}

// == Основные модели ==
export interface Product {
  id: UUID;
  title: string;
  description: string;
  price: Price;
  image: Url;
  categories: Category[];
}

export interface Category {
  id: UUID;
  title: string;
}

export interface CustomerInfo {
  email: Email;
  phone: PhoneNumber;
}

export interface DeliveryInfo {
  address: string;
}

export interface SubmitOrderResponse {
  orderId: UUID;
  message: string;
  totalAmount: Price;
}

export interface Order {
  products: Product[];
  deliveryInfo: DeliveryInfo;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
}

// == Модель корзины ==
export class Cart {
  products: Product[] = [];

  addProduct(product: Product): void {
    // implementation stub
  }

  removeProduct(productId: UUID): void {
    // implementation stub
  }

  clear(): void {
    // implementation stub
  }

  getTotal(): Price {
    return 0;
  }

  getCount(): number {
    return 0;
  }

  getProducts(): Product[] {
    return this.products;
  }
}

// == Сервисы ==
export interface OrderService {
  createOrder(
    cart: Cart,
    deliveryInfo: DeliveryInfo,
    customerInfo: CustomerInfo,
    paymentMethod: PaymentMethod
  ): Order;
}

export interface ApiClient {
  getProducts(): Promise<Product[]>;
  getProduct(id: UUID): Promise<Product>;
  submitOrder(order: Order): Promise<SubmitOrderResponse>;
}

// == EventEmitter ==
export interface EventEmitter {
  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;
  off<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
}

// == Карта событий ==
export interface EventMap {
  buy: UUID;
  remove: UUID;
  clear: void;
  order: void;
  cancel: void;
  submit: void;
  'submit:success': SubmitOrderResponse;
  'submit:error': string;
  'step:ready:1': { deliveryInfo: DeliveryInfo; paymentMethod: PaymentMethod };
  'step:ready:2': CustomerInfo;
  'checkout:back': void;
  showProductCard: UUID;
  closeProductCard: void;
  showCart: void;
  closeCart: void;
}

// == Представления ==
export interface CatalogView {
  render(products: Product[]): void;
  onProductClick(productId: UUID): void;
}

export interface ProductModalView {
  open(product: Product): void;
  close(): void;
  onBuyClick(): void;
  onRemoveClick(): void;
}

export interface CartView {
  render(cart: Cart): void;
  close(): void;
  onOrderClick(): void;
  onRemoveClick(productId: UUID): void;
  onClearClick(): void;
}

export interface OrderView {
  renderStep1(): void;
  renderStep2(): void;
  onSubmit(): void;
  onCancel(): void;
  getDeliveryInfo(): DeliveryInfo;
  getCustomerInfo(): CustomerInfo;
  getPaymentMethod(): PaymentMethod;
  getProducts(): Product[];
  getTotal(): Price;
  getCount(): number;
}

export interface NotificationView {
  showSuccess(response: SubmitOrderResponse): void;
  showError(message: string): void;
}

// == Презентеры ==

export abstract class ProductPresenter {
  constructor(
    public catalogView: CatalogView,
    public productModalView: ProductModalView,
    public apiClient: ApiClient,
    public eventBus: EventEmitter
  ) {}

  abstract init(): void;
}

export abstract class CartPresenter {
  constructor(
    public cartView: CartView,
    public cart: Cart,
    public eventBus: EventEmitter
  ) {}

  abstract init(): void;
}

export abstract class OrderPresenter {
  constructor(
    public orderView: OrderView,
    public cart: Cart,
    public apiClient: ApiClient,
    public orderService: OrderService,
    public notificationView: NotificationView,
    public eventBus: EventEmitter
  ) {}

  abstract  init(): void;
}