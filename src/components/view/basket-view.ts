import { ModalForm } from './modal-form';
import { ensureElement } from '../../utils/utils';
import { BasketShowEventSubscription, IBasket, IProduct, OrderShowEventTrigger } from '../../types';

export class BasketView {
  // Получаем шаблоны
  private basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
  private cardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
  private priceElement: HTMLSpanElement;
  private listElement: HTMLUListElement;
  private orderButton: HTMLButtonElement;

  constructor(private basket: IBasket, private modal: ModalForm,
    basketShowEventSubscription: BasketShowEventSubscription,
    private orderShowEventTrigger: OrderShowEventTrigger) {
    // Подписка на событие
    basketShowEventSubscription((basket) => this.showBasket(basket));
  }

  private showBasket(basket: IBasket): void {
    // Клонируем шаблон всей корзины
    const basketElement = this.basketTemplate.content.cloneNode(true) as HTMLElement;

    this.listElement = ensureElement<HTMLUListElement>('.basket__list', basketElement);
    this.priceElement = ensureElement<HTMLSpanElement>('.basket__price', basketElement);

    basket.products.forEach((product, index) => {
      const itemFragment = this.cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

      const itemIndex = ensureElement<HTMLSpanElement>('.basket__item-index', itemFragment);
      const itemTitle = ensureElement<HTMLSpanElement>('.card__title', itemFragment);
      const itemPrice = ensureElement<HTMLSpanElement>('.card__price', itemFragment);
      const itemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', itemFragment);

      itemIndex.textContent = String(index + 1);
      itemTitle.textContent = product.title;
      itemPrice.textContent = product.price ? `${product.price} синапсов` : "бесценно";
      itemDeleteButton.addEventListener('click', () => this.deleteBasketItem(product, itemFragment));

      this.listElement.append(itemFragment);
    });

    this.showTotal();
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', basketElement);
this.orderButton.addEventListener('click', () => {
  this.modal.close();
  this.orderShowEventTrigger(basket);
});

this.modal.setContent(basketElement);

// Блокируем кнопку, если сумма нулевая
this.orderButton.disabled = this.basket.total === 0;
    this.modal.open();
  }

  private showTotal() {
    this.priceElement.textContent = `${this.basket.total} синапсов`;
  }

  private deleteBasketItem(product: IProduct, itemFragment: HTMLElement) {
    itemFragment.remove();
    // Перенумеровываем оставшиеся элементы
    Array.from(this.listElement.children).forEach((child, i) => {
      const indexSpan = ensureElement<HTMLSpanElement>('.basket__item-index', child as HTMLElement);
      if (indexSpan) {
        indexSpan.textContent = String(i + 1);
      }
    });

    this.basket.removeProduct(product);
    this.showTotal();

    // Проверяем, есть ли товары с ценой больше 0
    const hasValuableItems = this.basket.products.some(p => p.price && p.price > 0);

    // Если в корзине только бесценные товары или корзина пуста, блокируем кнопку
    if (!hasValuableItems) {
      this.orderButton.disabled = true;
    }
  }

  private showOrder() {
    this.modal.close();
    this.orderShowEventTrigger(this.basket);
  }
}