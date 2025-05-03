import { ICustomerInfo } from "../../types";

export class CustomerInfoModel implements ICustomerInfo {
  constructor(
    public email: string = '',
    public phone: string = ''
  ) {}

  isValid(): boolean {
    return !!this.email.trim() && !!this.phone.trim();
  }

  getValidationError(): string | null {
    if (!this.email.trim()) return 'Не введён email.';
    if (!this.phone.trim()) return 'Не введён телефон.';
    return null;
  }
}