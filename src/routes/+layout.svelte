<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-white text-[#202124] flex flex-col font-sans antialiased selection:bg-[#FFF1F1] selection:text-[#FF7675]">
	{@render children()}
</div>
