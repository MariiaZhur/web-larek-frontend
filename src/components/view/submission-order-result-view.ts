import {
	ISubmissionOrderResult,
	SubmissionOrderResultShowEventSubscription,
} from '../../types';
import { ensureElement } from '../../utils/utils';
import { ModalForm } from './modal-form';

export class SubmissionOrderResultView {
	private successTemplate: HTMLTemplateElement;

	constructor(
		private modalForm: ModalForm,
		submissionOrderResultEventSubscription: SubmissionOrderResultShowEventSubscription
	) {
		this.successTemplate = ensureElement<HTMLTemplateElement>('#success');
		submissionOrderResultEventSubscription((submissionOrderResult) =>
			this.showSubmissionOrderResult(submissionOrderResult)
		);
	}

	private showSubmissionOrderResult(
		submissionOrderResult: ISubmissionOrderResult
	): void {
		const fragment = this.successTemplate.content.cloneNode(
			true
		) as DocumentFragment;
		const element = fragment.firstElementChild as HTMLElement;

		const price = ensureElement<HTMLElement>(
			'.order-success__description',
			element
		);
		const closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			element
		);

		price.textContent = `Списано ${submissionOrderResult.total} синапсов`;

		closeButton.addEventListener('click', () => {
			this.modalForm.close();
		});

		this.modalForm.setContent(element);
		this.modalForm.open();
	}
}
