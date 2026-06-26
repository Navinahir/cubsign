import { onMounted, onUnmounted, ref } from 'vue';

/**
 * Intersection Observer for fade-in / slide-up reveal animations.
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal(options = {}) {
    const {
        threshold = 0.12,
        rootMargin = '0px 0px -40px 0px',
        once = true,
    } = options;

    const elementRef = ref(null);
    const isVisible = ref(false);
    let observer = null;

    onMounted(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            isVisible.value = true;
            return;
        }

        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isVisible.value = true;
                    if (once && observer && elementRef.value) {
                        observer.unobserve(elementRef.value);
                    }
                } else if (!once) {
                    isVisible.value = false;
                }
            },
            { threshold, rootMargin },
        );

        if (elementRef.value) {
            observer.observe(elementRef.value);
        }
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return { elementRef, isVisible };
}
