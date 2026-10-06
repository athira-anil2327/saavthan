/**
 * Svelte 5 Global Theme Store
 * Defaults to 'light' mode with localStorage persistence.
 */

export type Theme = 'dark' | 'light';

let currentTheme = $state<Theme>('light');

export function getTheme(): Theme {
	return currentTheme;
}

export function initTheme(): void {
	if (typeof window === 'undefined') return;

	const stored = localStorage.getItem('vault-theme') as Theme | null;
	if (stored === 'light' || stored === 'dark') {
		currentTheme = stored;
	} else {
		// Default to light
		currentTheme = 'light';
	}
	applyTheme(currentTheme);
}

export function setTheme(theme: Theme): void {
	currentTheme = theme;
	if (typeof window !== 'undefined') {
		localStorage.setItem('vault-theme', theme);
		applyTheme(theme);
	}
}

export function toggleTheme(): void {
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function applyTheme(theme: Theme): void {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (theme === 'dark') {
		root.classList.add('dark');
		root.setAttribute('data-theme', 'dark');
		root.style.colorScheme = 'dark';
	} else {
		root.classList.remove('dark');
		root.setAttribute('data-theme', 'light');
		root.style.colorScheme = 'light';
	}
}
