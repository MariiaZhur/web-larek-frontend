import { EventEmitter, EventSubscription } from "./components/base/events";
import { Api } from "./components/base/api";
import { API_URL } from "./utils/constants";
import { AppEvent, IBasket, IOrder, IProduct, IProductListResponse, ISubmissionOrderResult, SubmissionOrderResultShowEventTrigger, Url } from "./types";
import { CatalogView } from "./components/view/catalog-view";
import { ensureElement } from "./utils/utils";
import { EventsLogger } from "./components/base/events-logger";
import { ModalForm } from "./components/view/modal-form";
import { ProductDetailesView } from "./components/view/product-details-view";
import { BasketModel } from "./components/models/basket-model";
import { BasketHeaderView } from "./components/view/basket-header-view";
import { BasketView } from "./components/view/basket-view";
import { OrderView } from "./components/view/order-view";
import { SubmitOrderResultModel } from "./components/models/submit-order-result-model";
import { SubmissionOrderResultView } from "./components/view/submission-order-result-view";

export class Application {
  private eventEmitter = new EventEmitter(); // Центральный EventEmitter
  private api = new Api(API_URL + '/'); // Клиент API
  private productsPath: Url = "product";
  private orderPath: Url = "order";
  private logger = new EventsLogger();
  private basket: IBasket;
  private submissionOrderResultEventTrigger: SubmissionOrderResultShowEventTrigger;


  private constructor() {
    //console.log("Starting Application...");
    // Подписываем логгер на все события
    this.eventEmitter.onAll(({ eventName, data }) => this.logger.log(eventName, data));

    // Создаем каталог
    const productListResponse: Promise<IProductListResponse> = this.api.get<IProductListResponse>(this.productsPath);
    const gallery = ensureElement<HTMLElement>('.gallery');
    const productShowDetailsEventTrigger = this.eventEmitter.createTrigger(AppEvent.ProductShowDetails);
    productListResponse
      .then((productList) => {
        new CatalogView(gallery, productList.items, productShowDetailsEventTrigger);
      });

    // Создаем универсальное модальное окно
    const modalForm = new ModalForm();

    // Создаем ProductDetailesView
    const productShowDetailsEventSubscription = this.eventEmitter.createSubscription<IProduct>(AppEvent.ProductShowDetails);
    const productAddToBusketEventTrigger = this.eventEmitter.createTrigger<IProduct>(AppEvent.BasketAddProduct);
    const productDetailesView = new ProductDetailesView(modalForm, productShowDetailsEventSubscription, productAddToBusketEventTrigger);

    // Создаем Модель Корзины
    const basketRefreshViewEventTrigger = this.eventEmitter.createTrigger<IBasket>(AppEvent.BasketRefreshView);
    this.basket = new BasketModel(basketRefreshViewEventTrigger);
    this.eventEmitter.on<IProduct>(AppEvent.BasketAddProduct, (product) => this.basket.addProduct(product));

    // Создаем презентер для иконк корзины и счетчика
    const basketShowEventTrigger = this.eventEmitter.createTrigger<IBasket>(AppEvent.BasketShow);
    const basketHeaderView = new BasketHeaderView(this.basket, basketShowEventTrigger);
    this.eventEmitter.on<IBasket>(AppEvent.BasketRefreshView, (bsk) => basketHeaderView.refreshCounter(bsk));

    // Презентер для корзины в модальном окне
    const basketShowEventSubscription = this.eventEmitter.createSubscription<IBasket>(AppEvent.BasketShow);
    const orderShowEventTrigger = this.eventEmitter.createTrigger<IBasket>(AppEvent.OrderShow);
    const basketView = new BasketView(this.basket, modalForm, basketShowEventSubscription, orderShowEventTrigger);

    // Презентер ддя оформленияя заказа
    const orderShowEventSubscription = this.eventEmitter.createSubscription<IBasket>(AppEvent.OrderShow);
    const orderSubmitEventTrigger = this.eventEmitter.createTrigger<IOrder>(AppEvent.OrderSubmit);
    const orderView = new OrderView(modalForm, orderShowEventSubscription, orderSubmitEventTrigger);
    this.eventEmitter.on<IOrder>(AppEvent.OrderSubmit, (order) => this.submitOrder(order));

    this.submissionOrderResultEventTrigger = this.eventEmitter.createTrigger<ISubmissionOrderResult>(AppEvent.OrderShowSubmissionResult);

    //Презентер для результата обработки заказа
    const submissionOrderResultViewSubsccription = this.eventEmitter.createSubscription<ISubmissionOrderResult>(AppEvent.OrderShowSubmissionResult);
    const submitOrderResultView = new SubmissionOrderResultView(modalForm, submissionOrderResultViewSubsccription);
  }

  private submitOrder(order: IOrder) {
    //console.log(`Send API request with order ${order}`);
    this.api.post(this.orderPath, order)
      .then((response: SubmitOrderResultModel) => {
        //console.log('Успешно отправлено:', response);
        this.submissionOrderResultEventTrigger(response);
        this.basket.clear();
      })
      .catch(err => {
        console.error('Ошибка при отправке заказа:', err);
      });
  }

  public static bootstrap() {
    const app = new Application();
    return app;
  }
}
