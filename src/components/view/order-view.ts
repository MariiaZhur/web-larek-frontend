import {
	IBasket,
	OrderShowEventSubscription,
	OrderSubmitEventTrigger,
	PaymentMethod,
} from '../../types';
import { ensureElement } from '../../utils/utils';
import { CustomerInfoModel } from '../models/customer-info-model';
import { OrderModel } from '../models/order-model';
import { ShippingAndPaymentInfoModel } from '../models/shipping-and-payment-info-model';
import { ModalForm } from './modal-form';

export class OrderView {
	private orderTemplate: HTMLTemplateElement;
	private shippingAndPaymentInfoModel = new ShippingAndPaymentInfoModel();
	private customerInfoModel = new CustomerInfoModel();
	contactsTemplate: HTMLTemplateElement;

	constructor(
		private modalForm: ModalForm,
		private orderShowEventSubscription: OrderShowEventSubscription,
		private orderSubmitEventTrigger: OrderSubmitEventTrigger
	) {
		orderShowEventSubscription((basket) => this.showOrder(basket));
		this.orderTemplate = ensureElement<HTMLTemplateElement>('#order');
		this.contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
	}

	private showOrder(basket: IBasket) {
		this.showOrderStepOneForm(basket);
	}

	private showOrderStepOneForm(basket: IBasket): void {
		const formFragment = this.orderTemplate.content.cloneNode(
			true
		) as DocumentFragment;
		const formElement = formFragment.firstElementChild as HTMLFormElement;

		const buttonCardPayment = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			formElement
		);
		const buttonCashPayment = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			formElement
		);
		const addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			formElement
		);
		const nextButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			formElement
		);
		const errorSpan = ensureElement<HTMLSpanElement>(
			'.form__errors',
			formElement
		);

		// const updateModel = () => {
		//     this.shippingAndPaymentInfoModel.address = addressInput.value;
		// };
		const updateModel = () => {
			this.shippingAndPaymentInfoModel.address = addressInput.value.trim();

			if (buttonCardPayment.classList.contains('button_alt-active')) {
				this.shippingAndPaymentInfoModel.paymentMethod = PaymentMethod.Online;
			} else if (buttonCashPayment.classList.contains('button_alt-active')) {
				this.shippingAndPaymentInfoModel.paymentMethod = PaymentMethod.Cash;
			} else {
				this.shippingAndPaymentInfoModel.paymentMethod = null;
			}
		};

		const validateForm = () => {
			updateModel();
			const error = this.shippingAndPaymentInfoModel.getValidationError();
			nextButton.disabled = !!error;
			errorSpan.textContent = error ?? '';
		};

		buttonCardPayment.addEventListener('click', () => {
			this.shippingAndPaymentInfoModel.paymentMethod = PaymentMethod.Online;
			buttonCardPayment.classList.add('button_alt-active');
			buttonCashPayment.classList.remove('button_alt-active');
			validateForm();
		});

		buttonCashPayment.addEventListener('click', () => {
			this.shippingAndPaymentInfoModel.paymentMethod = PaymentMethod.Cash;
			buttonCashPayment.classList.add('button_alt-active');
			buttonCardPayment.classList.remove('button_alt-active');
			validateForm();
		});

		addressInput.addEventListener('input', validateForm);

		formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			updateModel();

			if (this.shippingAndPaymentInfoModel.isValid()) {
				this.showOrderStepTwoForm(basket); // будет использовать `this.orderModel.customerInfo`
			}
		});

		this.modalForm.setContent(formElement);
		this.modalForm.open();
	}

	private showOrderStepTwoForm(basket: IBasket): void {
		const formFragment = this.contactsTemplate.content.cloneNode(
			true
		) as DocumentFragment;
		const formElement = formFragment.firstElementChild as HTMLFormElement;

		const emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			formElement
		);
		const phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			formElement
		);
		const submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			formElement
		);
		const errorSpan = ensureElement<HTMLSpanElement>(
			'.form__errors',
			formElement
		);

		const updateModel = () => {
			this.customerInfoModel.email = emailInput.value;
			this.customerInfoModel.phone = phoneInput.value;
		};

		const validateForm = () => {
			updateModel();
			const error = this.customerInfoModel.getValidationError();
			submitButton.disabled = !!error;
			errorSpan.textContent = error ?? '';
		};

		emailInput.addEventListener('input', validateForm);
		phoneInput.addEventListener('input', validateForm);

		formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			updateModel();
			const orderModel = new OrderModel(
				basket,
				this.shippingAndPaymentInfoModel,
				this.customerInfoModel
			);
			if (this.customerInfoModel.isValid()) {
				this.modalForm.close();
				this.orderSubmitEventTrigger(orderModel);
			}
		});
		this.modalForm.setContent(formElement);
	}
}
