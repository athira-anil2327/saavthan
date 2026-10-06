import "./server.js";
//#region src/lib/nav.svelte.ts
var MobileNavState = class {
	isOpen = false;
	toggle() {
		this.isOpen = !this.isOpen;
	}
	open() {
		this.isOpen = true;
	}
	close() {
		this.isOpen = false;
	}
};
var mobileNav = new MobileNavState();
//#endregion
export { mobileNav as t };

//# sourceMappingURL=nav.svelte.js.map