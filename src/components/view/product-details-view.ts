import { ModalForm } from './modal-form';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { ProductAddToBusketEventTrigger, IProduct, ProductShowDetailsEventSubscription } from '../../types';

export class ProductDetailesView {
  private template = ensureElement<HTMLTemplateElement>('#card-preview');

  constructor(private modal: ModalForm, showProductDetailsEventSubscription: ProductShowDetailsEventSubscription, private addProductToBusketEventTrigger: ProductAddToBusketEventTrigger) {
    // Подписка на событие
    showProductDetailsEventSubscription((product) => this.showProductDetailsCard(product));
  }

  private showProductDetailsCard(product: IProduct): void {
    //console.log("Прилетело сообщение, сработала подписка");

    const cardElement = this.template.content.cloneNode(true) as HTMLElement;

    // Инициализация элементов один раз
    const image = ensureElement<HTMLImageElement>('.card__image', cardElement);
    const category = ensureElement<HTMLSpanElement>('.card__category', cardElement);
    const title = ensureElement<HTMLHeadingElement>('.card__title', cardElement);
    const description = ensureElement<HTMLParagraphElement>('.card__text', cardElement);
    const price = ensureElement<HTMLSpanElement>('.card__price', cardElement);
    const button = ensureElement<HTMLButtonElement>('.card__button', cardElement);
    image.src = CDN_URL + product.image;
    image.alt = product.title;
    category.textContent = product.category;
    title.textContent = product.title;
    description.textContent = product.description;
    price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
    button.textContent = 'В корзину';
    button.addEventListener('click', () => { this.addProductToBusketEventTrigger(product); this.modal.close() });

    this.modal.setContent(cardElement);
    this.modal.open();
  }
}

