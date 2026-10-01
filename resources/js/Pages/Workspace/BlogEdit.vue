<script setup>
import BlogForm from '@/Components/Workspace/BlogForm.vue';

defineProps({
    blog: { type: Object, required: true },
    categories: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
    relatedOptions: { type: Array, default: () => [] },
});
</script>

<template>
    <BlogForm
        mode="edit"
        :blog="blog"
        :categories="categories"
        :statuses="statuses"
        :related-options="relatedOptions"
    />
</template>
