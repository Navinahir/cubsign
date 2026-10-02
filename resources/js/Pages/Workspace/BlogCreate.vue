<script setup>
import BlogForm from '@/Components/Workspace/BlogForm.vue';

defineProps({
    categories: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
    relatedOptions: { type: Array, default: () => [] },
    defaults: { type: Object, default: () => ({}) },
});
</script>

<template>
    <BlogForm
        mode="create"
        :categories="categories"
        :statuses="statuses"
        :related-options="relatedOptions"
        :defaults="defaults"
    />
</template>
