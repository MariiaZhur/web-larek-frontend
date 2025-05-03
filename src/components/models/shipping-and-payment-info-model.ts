import { IShippingAndPaymentInfo, PaymentMethod } from "../../types";

export class ShippingAndPaymentInfoModel implements IShippingAndPaymentInfo {
  constructor(
    public address: string = '',
    public paymentMethod: PaymentMethod | null = null
  ) {}

  isValid(): boolean {
    return !!this.address.trim() && this.paymentMethod !== null;
  }

  getValidationError(): string | null {
    if (!this.paymentMethod) return 'Не выбран способ оплаты.';
    if (!this.address.trim()) return 'Не введён адрес.';
    return null;
  }
}