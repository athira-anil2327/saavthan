<script lang="ts">
	let { children } = $props();
</script>

<div class="w-full flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-8 lg:px-12 min-h-[calc(100vh-56px)]">
	<div class="w-full max-w-6xl mx-auto">
		{@render children()}
	</div>
</div>

