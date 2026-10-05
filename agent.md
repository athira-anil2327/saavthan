# Agent Development Guide

Welcome to the **Hackathena** codebase. This document outlines the architectural standards, design principles, and coding practices required for all AI agents and developers working on this project.

---

## 1. Core Stack & Architecture

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) with **Svelte 5 (Runes)**
- **Language**: TypeScript (Strict Mode)
- **UI & Components**: [shadcn-svelte](https://shadcn-svelte.com/) (Style: `nova`, Base: `neutral`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with semantic CSS variables
- **Icons**: [Lucide Icons](https://lucide.dev/) (`@lucide/svelte`)
- **Import Alias**: `#lib/*` (maps to `src/lib/*` via package subpath imports)

---

## 2. Zero-Slop Coding Standards

To maintain clean, maintainable, enterprise-grade software:

- ❌ **No Arbitrary Hardcoded Colors**: Do not sprinkle random hex/RGB color codes across components when shadcn theme tokens exist.
- ❌ **No Legacy Svelte Syntax**: Do not use `export let`, `$:`, or `on:click`. Svelte 5 Runes are mandatory.
- ❌ **No Duplicate Boilerplate**: Keep components DRY, modular, and typed.
- ❌ **No Blind Type Suppressions**: Avoid `@ts-ignore` or `any` unless working around third-party package type collisions (must include explicit explanatory comments).
- ❌ **No Unused Imports or Dead Code**: Always keep files clean and lint-free.
- ✅ **Single Source of Truth**: Leverage `components.json`, `layout.css`, and `#lib/utils.ts`.

---

## 3. shadcn-svelte Theming & Styling Rules

All components must adhere strictly to the project's shadcn design system.

### Semantic Color Tokens

Use Tailwind classes linked to semantic CSS variables:

| Purpose | Background / Surface | Text / Foreground | Border / Ring |
|---|---|---|---|
| **Base App** | `bg-background` | `text-foreground` | `border-border` |
| **Muted / Subdued** | `bg-muted` | `text-muted-foreground` | `border-muted` |
| **Card / Surface** | `bg-card` | `text-card-foreground` | `border-border` |
| **Popover / Menu** | `bg-popover` | `text-popover-foreground` | `border-border` |
| **Primary Action** | `bg-primary` | `text-primary-foreground` | `ring-ring` |
| **Secondary Action** | `bg-secondary` | `text-secondary-foreground` | `border-border` |
| **Accent / Highlight** | `bg-accent` | `text-accent-foreground` | `border-border` |
| **Destructive / Error** | `bg-destructive` | `text-destructive-foreground` | `border-destructive` |

### Radius Tokens
- `rounded-sm`: calc(var(--radius) * 0.6)
- `rounded-md`: calc(var(--radius) * 0.8)
- `rounded-lg`: var(--radius)
- `rounded-xl`: calc(var(--radius) * 1.4)
- `rounded-2xl`: calc(var(--radius) * 1.8)

### Adding New shadcn Components
Use the CLI to install components cleanly rather than manually writing primitives:
```bash
npx shadcn-svelte@latest add <component-name> -y -o
```

---

## 4. Svelte 5 Runes Standards

### Props
```svelte
<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		count?: number;
		children?: import('svelte').Snippet;
	}

	let { title, description = '', count = 0, children }: Props = $props();
</script>
```

### State & Reactivity
```svelte
<script lang="ts">
	let count = $state(0);
	let doubleCount = $derived(count * 2);

	function increment() {
		count += 1;
	}
</script>
```

### Two-Way Binding
```svelte
<script lang="ts">
	let { value = $bindable('') }: { value?: string } = $props();
</script>
```

### Snippets & Children Projection
```svelte
{#if children}
	{@render children()}
{/if}
```

---

## 5. File & Folder Conventions

```
src/
├── lib/
│   ├── assets/              # Static media & SVGs
│   ├── components/
│   │   ├── ui/              # shadcn-svelte UI components (button, card, etc.)
│   │   └── *.svelte         # Feature / shared components
│   ├── hooks/               # Svelte reactive hooks (e.g., is-mobile.svelte.ts)
│   ├── utils.ts             # cn() and class merging utilities
│   └── index.ts             # Public library entry
└── routes/
    ├── +layout.svelte       # Global root layout (imports layout.css)
    ├── layout.css           # Tailwind v4 & shadcn Nova theme tokens
    ├── +page.svelte         # Home page
    └── [route]/             # Isolated route trees
        ├── +layout.svelte   # Route-specific locked shell (if persistent)
        ├── +page.svelte     # Route page
        └── components/      # Route-scoped components
```

---

## 6. Verification Checklist

Before completing any task or pull request, ensure the following commands pass:

1. **Type Checking**:
   ```bash
   npm run check
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
3. **Linting & Formatting**:
   ```bash
   npm run lint
   npm run format
   ```
