import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if user prefers reduced motion for accessibility compliance
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subtle staggered card / panel entrance
 */
export function animateStaggerCards(cards: HTMLElement[] | NodeListOf<HTMLElement> | string, parent?: HTMLElement) {
	if (typeof window === 'undefined' || prefersReducedMotion()) return;

	const targets = typeof cards === 'string' && parent ? parent.querySelectorAll(cards) : cards;
	if (!targets) return;

	return gsap.from(targets, {
		opacity: 0,
		y: 10,
		duration: 0.35,
		stagger: 0.04,
		ease: 'power2.out',
		clearProps: 'transform,opacity'
	});
}

export { gsap, ScrollTrigger };
