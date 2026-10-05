<script lang="ts">
	import { Download } from "@lucide/svelte";
	import * as Card from "#lib/components/ui/card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Badge } from "#lib/components/ui/badge/index.js";

	export interface DownloadOption {
		id: "linux" | "windows" | "macos";
		name: string;
		subtitle: string;
		version: string;
		architecture: string;
		size: string;
		href: string;
		buttonText: string;
	}

	let { option }: { option: DownloadOption } = $props();
</script>

<Card.Root class="bg-[#FFFFFF] border-[#E5E7EB] rounded-xl p-8 flex flex-col justify-between h-full shadow-none hover:border-[#ff7675]/50 transition-all duration-200">
	<div>
		<!-- Platform Icon Container -->
		<div class="w-14 h-14 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-6">
			{#if option.id === "linux"}
				<!-- Linux / Tux Icon -->
				<svg class="size-7" viewBox="0 0 24 24" fill="currentColor" aria-label="Linux">
					<path d="M12.002 2c-2.485 0-4.002 1.95-4.002 4.25 0 .894.241 1.763.666 2.5a4.8 4.8 0 0 0-1.666 3.75c0 2.22 1.34 3.9 3.002 4.375v.125c-.886.37-2.125 1.154-2.125 2.25 0 1.243 1.958 2.75 4.125 2.75s4.125-1.507 4.125-2.75c0-1.096-1.239-1.88-2.125-2.25v-.125c1.662-.475 3.002-2.155 3.002-4.375a4.8 4.8 0 0 0-1.666-3.75c.425-.737.666-1.606.666-2.5C16.004 3.95 14.487 2 12.002 2zm-1.5 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1.5 3.75c.828 0 1.5.336 1.5.75s-.672.75-1.5.75-1.5-.336-1.5-.75.672-.75 1.5-.75z" />
				</svg>
			{:else if option.id === "windows"}
				<!-- Windows Icon -->
				<svg class="size-6" viewBox="0 0 24 24" fill="currentColor" aria-label="Windows">
					<path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
				</svg>
			{:else if option.id === "macos"}
				<!-- Apple Icon -->
				<svg class="size-7" viewBox="0 0 24 24" fill="currentColor" aria-label="macOS">
					<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.61 1.34-.56.64-1.04 1.71-.92 2.74 1.01.08 2.03-.51 2.61-1.23z" />
				</svg>
			{/if}
		</div>

		<!-- Card Title & Subtitle -->
		<Card.Title class="text-2xl font-semibold text-[#202124] mb-1">
			{option.name}
		</Card.Title>
		<Card.Description class="text-sm text-[#6B7280] mb-6">
			{option.subtitle}
		</Card.Description>

		<!-- Metadata Badges -->
		<div class="flex flex-wrap items-center gap-2 mb-8">
			<Badge
				variant="outline"
				class="bg-[#F8F9FA] text-[#6B7280] border-[#E5E7EB] text-xs font-medium px-2.5 py-0.5 rounded-full"
			>
				{option.version}
			</Badge>
			<Badge
				variant="outline"
				class="bg-[#F8F9FA] text-[#6B7280] border-[#E5E7EB] text-xs font-medium px-2.5 py-0.5 rounded-full"
			>
				{option.architecture}
			</Badge>
			<Badge
				variant="outline"
				class="bg-[#F8F9FA] text-[#6B7280] border-[#E5E7EB] text-xs font-medium px-2.5 py-0.5 rounded-full"
			>
				{option.size}
			</Badge>
		</div>
	</div>

	<!-- Download Button -->
	<Card.Footer class="p-0">
		<Button
			href={option.href}
			class="w-full h-11 bg-[#ff7675] hover:bg-[#e66766] text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-none cursor-pointer"
		>
			<Download class="size-4 stroke-[2]" />
			<span>{option.buttonText}</span>
		</Button>
	</Card.Footer>
</Card.Root>
