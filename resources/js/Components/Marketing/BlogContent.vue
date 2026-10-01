<script setup>
import { computed, nextTick, onMounted, watch } from 'vue';

const props = defineProps({
    content: { type: String, default: '' },
});

const emit = defineEmits(['headings']);

const htmlWithHeadingIds = computed(() => {
    let index = 0;
    return String(props.content ?? '').replace(
        /<(h[1-6])(\s[^>]*)?>/gi,
        (match, tag, attrs = '') => {
            if (/\sid\s*=/i.test(attrs)) {
                return match;
            }
            const id = `heading-${index}`;
            index += 1;
            return `<${tag}${attrs} id="${id}">`;
        },
    );
});

function extractHtmlHeadings(html) {
    const headings = [];
    const re = /<(h[1-6])[^>]*\sid=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
        const title = match[3].replace(/<[^>]+>/g, '').trim();
        if (title) headings.push({ id: match[2], title });
    }
    if (!headings.length) {
        let i = 0;
        const plain = /<(h[1-6])(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
        while ((match = plain.exec(String(props.content ?? ''))) !== null) {
            const title = match[2].replace(/<[^>]+>/g, '').trim();
            if (title) {
                headings.push({ id: `heading-${i}`, title });
                i += 1;
            }
        }
    }
    return headings;
}

const headings = computed(() => extractHtmlHeadings(htmlWithHeadingIds.value));

watch(headings, (value) => emit('headings', value), { immediate: true });

onMounted(() => {
    nextTick(() => emit('headings', headings.value));
});
</script>

<template>
    <div class="blog-prose">
        <div
            class="blog-html-content"
            v-html="htmlWithHeadingIds"
        />
    </div>
</template>

<style scoped>
.blog-html-content :deep(h1) {
    margin: 2.5rem 0 1rem;
    scroll-margin-top: 7rem;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #111827;
}
.blog-html-content :deep(h2) {
    margin: 2.5rem 0 1rem;
    scroll-margin-top: 7rem;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #111827;
}
.blog-html-content :deep(h3),
.blog-html-content :deep(h4),
.blog-html-content :deep(h5),
.blog-html-content :deep(h6) {
    margin: 2.5rem 0 1rem;
    scroll-margin-top: 7rem;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #111827;
}
.blog-html-content > :deep(p) {
    line-height: 1.625;
    color: #4b5563;
}
.blog-html-content :deep(ul) {
    margin: 0 0 1.25rem;
    list-style: disc;
    padding-left: 1.25rem;
    font-size: 1rem;
    color: #4b5563;
}
.blog-html-content :deep(ol) {
    margin: 0 0 1.25rem;
    list-style: decimal;
    padding-left: 1.25rem;
    font-size: 1rem;
    color: #4b5563;
}
.blog-html-content :deep(li) {
    margin: 0.5rem 0;
}
.blog-html-content :deep(blockquote) {
    margin: 0 0 1.25rem;
    border-left: 4px solid #3b82f6;
    background: rgba(239, 246, 255, 0.5);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-style: italic;
    line-height: 1.625;
    color: #374151;
}
.blog-html-content :deep(a:not([style*="color"])) {
    color: #2563eb;
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: #bfdbfe;
    text-underline-offset: 2px;
}

.blog-html-content :deep(span[style*="color"] a) {
    color: inherit;
}

.blog-html-content :deep(a[style*="color"]) {
    color: inherit;
}

.blog-html-content :deep(a:hover) {
    text-decoration-color: #60a5fa;
}
.blog-html-content > :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 0 0 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    object-fit: cover;
}
.blog-html-content :deep(hr) {
    margin: 2rem 0;
    border-color: #e5e7eb;
}
.blog-html-content :deep(strong),
.blog-html-content :deep(b) {
    font-weight: 700;
}
.blog-html-content :deep(em),
.blog-html-content :deep(i) {
    font-style: italic;
}
.blog-html-content :deep(u) {
    text-decoration: underline;
}

.blog-html-content > :deep(figure) {
    margin: 2rem 0;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    background: #ffffff;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(0, 0, 0, 0.04);
}

.blog-html-content > :deep(figure img) {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    margin: 0;
    border: 0;
    border-radius: 0;
    object-fit: cover;
}

.blog-html-content :deep(figcaption) {
    border-top: 1px solid #f3f4f6;
    background: #f9fafb;
    padding: 0.75rem 1rem;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.625;
    color: #6b7280;
}
</style>
