import { IProduct, ProductShowDetailsEventTrigger } from '../../types'; 
import { ProductView } from './product-view';

export class CatalogView {
  products: IProduct[]; // Список товаров
  parentContainer: HTMLElement; // DOM-контейнер для каталога
  productViews: ProductView[]; // Массив карточек товаров

  constructor(
      parentContainer: HTMLElement,
      products: IProduct[], // Получаем массив товаров
      showProductDetailsEventTrigger: ProductShowDetailsEventTrigger // Получаем триггер для показа деталей
  ) {
      // Инициализируем поля
      this.parentContainer = parentContainer;
      this.products = products;
      // Создаем карточки для каждого товара
      this.productViews = products.map(product => 
          new ProductView(parentContainer, product, showProductDetailsEventTrigger)    // Передаем товар и триггер
      );
  }
}