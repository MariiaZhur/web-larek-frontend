import { IProduct, ProductShowDetailsEventTrigger } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class ProductView {
    element: HTMLElement; // DOM-элемент карточки
    product: IProduct; // Данные товара
    cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

    constructor(
        parentElement: HTMLElement,
        product: IProduct, // Получаем данные товара
        private showProductDetailsEventTrigger:ProductShowDetailsEventTrigger // Получаем триггер
    ) {
        this.product = product;
        this.element = this.createCard(); // Создаем HTML-карточку
        parentElement.append(this.element);
    }

    // Создание HTML-разметки карточки
    private createCard(): HTMLElement {
        // Создаем элемент из шаблона
        const card = this.cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
        
        // Находим элементы внутри карточки
        const title = ensureElement<HTMLHeadingElement>('.card__title', card);
        const category = ensureElement<HTMLSpanElement>('.card__category', card);
        const image = ensureElement<HTMLImageElement>('.card__image', card);
        const price = ensureElement<HTMLSpanElement>('.card__price', card);
        const button = ensureElement<HTMLButtonElement>('.gallery__item.card', card);
        
        // Заполняем данными
        title.textContent = this.product.title;
        category.textContent = this.product.category; 
        image.src = CDN_URL + this.product.image; 
        image.alt = this.product.title;
        price.textContent = this.product.price ?  `${this.product.price} синапсов` : 'Бесценно';
        
        button.addEventListener('click', () => {
            // При клике вызываем триггер и передаем товар
            this.showProductDetailsEventTrigger(this.product);    // Генерируем событие
        });
        return card;
    }
}