import { _ as attr, d as slot, f as spread_props, i as derived, o as ensure_array_like, s as head, t as attr_class, u as sanitize_props, x as escape_html } from "../../../chunks/server.js";
import "../../../chunks/state.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Check } from "../../../chunks/check.js";
import { a as File_archive, i as File_code, n as File_question_mark, o as Cloud_upload, r as File_image, t as File_spreadsheet } from "../../../chunks/file-spreadsheet.js";
import { c as Trash_2, l as File_text } from "../../../chunks/saavthan-api.js";
import { t as Refresh_cw } from "../../../chunks/refresh-cw.js";
//#region node_modules/lucide-svelte/dist/icons/circle-check.svelte
function Circle_check($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	/**
	* @license lucide-svelte v1.0.1 - ISC
	*
	* ISC License
	*
	* Copyright (c) 2026 Lucide Icons and Contributors
	*
	* Permission to use, copy, modify, and/or distribute this software for any
	* purpose with or without fee is hereby granted, provided that the above
	* copyright notice and this permission notice appear in all copies.
	*
	* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*
	* ---
	*
	* The following Lucide icons are derived from the Feather project:
	*
	* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
	*
	* The MIT License (MIT) (for the icons listed above)
	*
	* Copyright (c) 2013-present Cole Bemis
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in all
	* copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	* SOFTWARE.
	*
	*/
	Icon($$renderer, spread_props([
		{ name: "circle-check" },
		$$sanitized_props,
		{
			/**
			* @component @name CircleCheck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}], ["path", { "d": "m9 12 2 2 4-4" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/routes/upload/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedFiles = [];
		function formatBytes(bytes) {
			if (!bytes || bytes === 0) return "0 B";
			const k = 1024;
			const sizes = [
				"B",
				"KB",
				"MB",
				"GB"
			];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
		}
		function getFileIcon(name) {
			const ext = name.split(".").pop()?.toLowerCase() || "";
			if ([
				"png",
				"jpg",
				"jpeg",
				"webp",
				"svg"
			].includes(ext)) return File_image;
			if ([
				"pdf",
				"doc",
				"docx",
				"txt"
			].includes(ext)) return File_text;
			if ([
				"zip",
				"tar",
				"gz",
				"7z"
			].includes(ext)) return File_archive;
			if ([
				"xls",
				"xlsx",
				"csv"
			].includes(ext)) return File_spreadsheet;
			if ([
				"js",
				"ts",
				"py",
				"json",
				"html",
				"css"
			].includes(ext)) return File_code;
			return File_question_mark;
		}
		let unverifiedCount = derived(() => selectedFiles.filter((f) => f.status !== "verified").length);
		head("tziouu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Vault — Direct Upload Portal</title>`);
			});
		});
		$$renderer.push(`<div class="space-y-6"><input type="file" multiple="" class="hidden"/> <div class="upload-header text-center space-y-1"><h1 class="text-2xl font-bold tracking-tight text-foreground">Upload to Vault</h1> <p class="text-xs text-muted-foreground">Files are end-to-end encrypted with AES-256 and signed with Ed25519 tree-hashes.</p></div> <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch"><div${attr_class(`upload-panel md:col-span-2 w-full h-full min-h-[360px] md:min-h-[420px] rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-gradient-to-b from-muted/80 via-muted/40 to-background flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all shadow-xs select-none`)}><div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-primary mb-4 shadow-sm transition-transform hover:scale-105">`);
		Cloud_upload($$renderer, { class: "w-8 h-8 sm:w-10 sm:h-10 text-primary" });
		$$renderer.push(`<!----></div> <h2 class="text-base sm:text-lg font-bold text-foreground tracking-tight">${escape_html("Choose files to upload")}</h2> <p class="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-[260px] leading-relaxed">Tap here or drag &amp; drop documents, photos, or archives</p> <p class="text-[11px] text-muted-foreground/80 mt-3 font-mono">Max 500 MB per file</p></div> <div class="upload-panel md:col-span-3 flex flex-col justify-between h-full min-h-[360px] md:min-h-[420px] bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4"><div class="space-y-4 flex-1 flex flex-col min-h-0"><div class="flex items-center justify-between pb-2 border-b border-border/60"><h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected Files (${escape_html(selectedFiles.length)})</h3> `);
		if (selectedFiles.length > 0 && true) $$renderer.push(`<!--[0--><button type="button" class="text-xs text-destructive hover:underline cursor-pointer">Clear All</button>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="flex-1 overflow-y-auto max-h-[300px] md:max-h-[340px] pr-1 space-y-2.5">`);
		if (selectedFiles.length === 0) {
			$$renderer.push(`<!--[0--><div class="h-full min-h-[240px] w-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/70 rounded-xl bg-muted/10 text-xs sm:text-sm text-muted-foreground">`);
			Cloud_upload($$renderer, { class: "w-10 h-10 opacity-30 mb-3" });
			$$renderer.push(`<!----> <span class="max-w-[280px] leading-relaxed">No files selected yet. Click or drop files into the upload box on the left.</span></div>`);
		} else {
			$$renderer.push(`<!--[-1--><!--[-->`);
			const each_array = ensure_array_like(selectedFiles);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				const Icon = getFileIcon(item.file.name);
				$$renderer.push(`<div class="p-3 sm:p-3.5 rounded-xl border border-border bg-muted/30 shadow-xs flex items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><div class="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center shrink-0 border border-border">`);
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: "w-4 h-4 text-primary" });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(`</div> <div class="min-w-0"><p class="text-xs sm:text-sm font-medium text-foreground truncate max-w-[220px] sm:max-w-[340px]">${escape_html(item.file.name)}</p> <div class="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground mt-0.5"><span>${escape_html(formatBytes(item.file.size))}</span> `);
				if (item.status === "verified") {
					$$renderer.push(`<!--[0--><span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">`);
					Check($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push(`<!----> Verified</span>`);
				} else if (item.status === "uploading") {
					$$renderer.push(`<!--[1--><span class="text-primary font-medium flex items-center gap-1">`);
					Refresh_cw($$renderer, { class: "w-3.5 h-3.5 animate-spin" });
					$$renderer.push(`<!----> ${escape_html(item.progress)}%</span>`);
				} else if (item.status === "error") $$renderer.push(`<!--[2--><span class="text-destructive font-medium">${escape_html(item.error || "Failed")}</span>`);
				else $$renderer.push(`<!--[-1--><span>Queued</span>`);
				$$renderer.push(`<!--]--></div></div></div> <div class="flex items-center gap-1.5 shrink-0">`);
				if (item.status === "verified") {
					$$renderer.push("<!--[0-->");
					Circle_check($$renderer, { class: "w-4 h-4 text-emerald-600 dark:text-emerald-400" });
				} else {
					$$renderer.push(`<!--[1--><button type="button" class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" title="Remove selected file">`);
					Trash_2($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></div></div> <div class="upload-action-btn flex justify-center pt-3 pb-8"><button type="button"${attr("disabled", selectedFiles.length === 0 || unverifiedCount() === 0, true)} class="w-full max-w-[360px] sm:w-[360px] h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50">`);
		if (selectedFiles.length > 0 && unverifiedCount() === 0) {
			$$renderer.push("<!--[1-->");
			Circle_check($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----> <span>All Files Uploaded</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			Cloud_upload($$renderer, { class: "w-4 h-4" });
			$$renderer.push(`<!----> <span>Upload Files ${escape_html(unverifiedCount() > 0 ? `(${unverifiedCount()})` : "")}</span>`);
		}
		$$renderer.push(`<!--]--></button></div></div>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map