import "../../../chunks/server.js";
//#region src/routes/upload/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="w-full flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-8 lg:px-12 min-h-[calc(100vh-56px)]"><div class="w-full max-w-6xl mx-auto">`);
	children($$renderer);
	$$renderer.push(`<!----></div></div>`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map