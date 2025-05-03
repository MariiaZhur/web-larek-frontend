import { BasketShowEventTrigger, IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
export class BasketHeaderView {
    private basketCounter;
    constructor(basket: IBasket, basketShowEventTrigger: BasketShowEventTrigger) {
        // 1. Находим кнопку корзины
        const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
        // 2. Из этой кнопки вытаскиваем счётчик
        this.basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter', basketButton);
        this.refreshCounter(basket);
        basketButton.addEventListener('click', () => basketShowEventTrigger(basket));
    }

    public refreshCounter(basket: IBasket) {
        this.basketCounter.textContent = String(basket.getCount());
    }
}
