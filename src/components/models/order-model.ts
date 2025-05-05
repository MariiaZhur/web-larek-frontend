import {
	IBasket,
	ICustomerInfo,
	IOrder,
	IShippingAndPaymentInfo,
	PaymentMethod,
} from '../../types';

export class OrderModel implements IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[]; // product ids

	constructor(
		basket: IBasket,
		shippingAndPaymentInfo: IShippingAndPaymentInfo,
		customerInfo: ICustomerInfo
	) {
		this.payment = shippingAndPaymentInfo.paymentMethod!;
		this.email = customerInfo.email;
		this.phone = customerInfo.phone;
		this.address = shippingAndPaymentInfo.address;
		this.total = basket.total;
		const paidProducts = basket.products.filter((p) => (p.price ?? 0) > 0);
		this.items = paidProducts.map((p) => p.id);
	}
}
