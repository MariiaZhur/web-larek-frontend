import { IProduct, IBasket, BasketRefreshViewEventTrigger, Price } from "../../types";

export class BasketModel implements IBasket {
  public products: IProduct[]  = [];
  public total: Price =0 ;

  constructor(private basketRefreshViewEventTrigger: BasketRefreshViewEventTrigger) {
  }

  // Добавляет товар (триггер изменений)
  addProduct(product: IProduct): void {
    console.log(`Adding Product ${product.title}`); 
      if (!this.products.some(p => p.id === product.id)) {
          this.products.push(product);
          this.total+=product.price;
          //console.log(`Product added: ${product.title}`);
          this.basketRefreshViewEventTrigger(this);
      }
  }

  // Удаляет товар по ID (триггер изменений)
  removeProduct(product: IProduct): void {
      this.products = this.products.filter(p => p.id !== product.id);
      this.basketRefreshViewEventTrigger(this);
  }

  // Очищает корзину (триггер изменений)
  clear(): void {
      this.products = [];
      this.total = 0;
      this.basketRefreshViewEventTrigger(this);
  }

  // Возвращает количество товаров
  public getCount(): number {
      return this.products.length;
  }
}
