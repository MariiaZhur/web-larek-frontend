import { ensureElement } from '../../utils/utils';

export class ModalForm {
	private modalContainer: HTMLElement;
	private contentElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor() {
		this.modalContainer = ensureElement<HTMLElement>('#modal-container');
		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			this.modalContainer
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.modalContainer
		);
		this.modalContainer.addEventListener('click', (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (target === this.modalContainer) {
				this.close();
			}
		});
		this.closeButton.addEventListener('click', () => this.close());
	}

	public setContent(content: HTMLElement): void {
		this.contentElement.innerHTML = '';
		this.contentElement.appendChild(content);
	}

	private handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.close();
		}
	};

	public open(): void {
		document.addEventListener('keydown', this.handleEscape);
		document.body.style.overflow = 'hidden';
		this.modalContainer.classList.add('modal_active');
	}

	public close(): void {
		document.removeEventListener('keydown', this.handleEscape);
		this.modalContainer.classList.remove('modal_active');
		document.body.style.overflow = '';
		this.contentElement.innerHTML = '';
	}
}
