/**
 * Shared Mobile Navigation State (Svelte 5 Runes)
 */
class MobileNavState {
	isOpen = $state(false);

	toggle() {
		this.isOpen = !this.isOpen;
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}

export const mobileNav = new MobileNavState();
