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
 * Clean, subtle page entrance transition
 */
export function animatePageEntrance(container: HTMLElement, onComplete?: () => void) {
	if (!container || typeof window === 'undefined') return;
	if (prefersReducedMotion()) {
		gsap.set(container, { opacity: 1 });
		onComplete?.();
		return;
	}

	return gsap.fromTo(
		container,
		{ opacity: 0, y: 8 },
		{
			opacity: 1,
			y: 0,
			duration: 0.35,
			ease: 'power2.out',
			clearProps: 'transform,opacity',
			onComplete
		}
	);
}

/**
 * Subtle staggered card / panel entrance
 */
export function animateStaggerCards(cards: HTMLElement[] | NodeListOf<HTMLElement> | string, parent?: HTMLElement) {
	if (typeof window === 'undefined') return;
	if (prefersReducedMotion()) return;

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

/**
 * Smooth modal / dialog entrance
 */
export function animateModalIn(backdrop: HTMLElement | null, modalBox: HTMLElement | null) {
	if (typeof window === 'undefined') return;
	if (prefersReducedMotion()) return;

	const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
	if (backdrop) {
		tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2 });
	}
	if (modalBox) {
		tl.fromTo(
			modalBox,
			{ opacity: 0, scale: 0.97, y: 8 },
			{ opacity: 1, scale: 1, y: 0, duration: 0.25, clearProps: 'transform,opacity' },
			'<0.05'
		);
	}
	return tl;
}

/**
 * Micro hover/press animation on buttons and interactive cards
 */
export function setupButtonMicroInteractions(btn: HTMLElement) {
	if (!btn || typeof window === 'undefined' || prefersReducedMotion()) return;

	const onMouseEnter = () => gsap.to(btn, { scale: 1.015, duration: 0.15, ease: 'power1.out' });
	const onMouseLeave = () => gsap.to(btn, { scale: 1, duration: 0.15, ease: 'power1.out' });
	const onMouseDown = () => gsap.to(btn, { scale: 0.985, duration: 0.1, ease: 'power1.out' });
	const onMouseUp = () => gsap.to(btn, { scale: 1.015, duration: 0.15, ease: 'power1.out' });

	btn.addEventListener('mouseenter', onMouseEnter);
	btn.addEventListener('mouseleave', onMouseLeave);
	btn.addEventListener('mousedown', onMouseDown);
	btn.addEventListener('mouseup', onMouseUp);

	return () => {
		btn.removeEventListener('mouseenter', onMouseEnter);
		btn.removeEventListener('mouseleave', onMouseLeave);
		btn.removeEventListener('mousedown', onMouseDown);
		btn.removeEventListener('mouseup', onMouseUp);
	};
}

export { gsap, ScrollTrigger };
