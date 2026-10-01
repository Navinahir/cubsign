<script setup>
import { computed, reactive, ref, watch } from 'vue';
import Modal from '@/Components/Modal.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import {
    BLOG_BOX_IMAGE_POSITIONS,
    BLOG_BOX_IMAGE_WIDTHS,
    BLOG_BOX_THEMES,
    BLOG_BOX_TYPES,
    blogBoxEditorCss,
    buildBlogBoxHtml,
    defaultBlogBox,
} from '@/utils/blogBox';

const previewCss = blogBoxEditorCss('.blog-box-preview', { editorChrome: false });

const props = defineProps({
    show: { type: Boolean, default: false },
    mode: { type: String, default: 'insert' },
    values: { type: Object, default: null },
    uploading: { type: Boolean, default: false },
    uploadError: { type: String, default: '' },
});

const emit = defineEmits(['close', 'save', 'remove', 'upload']);

const themes = Object.values(BLOG_BOX_THEMES);

const form = reactive(defaultBlogBox());
const formError = ref('');
const previousType = { id: form.type, label: form.title };

watch(
    () => [props.show, props.values],
    () => {
        if (!props.show) {
            return;
        }
        Object.assign(form, defaultBlogBox(props.values || {}));
        formError.value = '';
        previousType.id = form.type;
        previousType.label = BLOG_BOX_TYPES.find((item) => item.id === form.type)?.label || form.title;
    },
    { immediate: true, deep: true },
);

const previewHtml = computed(() => buildBlogBoxHtml(form));
const isEdit = computed(() => props.mode === 'edit');

function onTypeChange(event) {
    const next = BLOG_BOX_TYPES.find((item) => item.id === event.target.value);
    if (!next) {
        return;
    }

    const currentTitle = String(form.title || '').trim();
    const previousDefault = BLOG_BOX_TYPES.find((item) => item.id === previousType.id)?.label || '';
    if (!currentTitle || currentTitle.toLowerCase() === previousDefault.toLowerCase()) {
        form.title = next.label;
    }

    if (next.id !== 'custom') {
        form.theme = next.defaultTheme;
    }

    previousType.id = next.id;
    previousType.label = next.label;
}

function onImageFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) {
        emit('upload', file, (url) => {
            form.imageUrl = url;
        });
    }
}

function removeImage() {
    form.imageUrl = '';
    form.imageAlt = '';
}

function save() {
    formError.value = '';
    if (!String(form.title || '').trim() && !String(form.body || '').trim()) {
        formError.value = 'Add a label or body text for this box.';
        return;
    }
    emit('save', { ...form });
}

function close() {
    emit('close');
}
</script>

<template>
    <Modal :show="show" max-width="3xl" @close="close">
        <form class="p-6" @submit.prevent="save">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                        {{ isEdit ? 'Edit box' : 'Insert box' }}
                    </h2>
                    <p class="mt-1 text-sm text-gray-500">
                        Styled callout that matches the published article.
                    </p>
                </div>
                <button
                    type="button"
                    class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    @click="close"
                >
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
                <div class="space-y-4">
                    <div class="grid gap-3 sm:grid-cols-2">
                        <label class="block text-sm">
                            <span class="mb-1 block font-medium text-gray-700">Type</span>
                            <select v-model="form.type" class="w-full rounded-md border-gray-300 text-sm" @change="onTypeChange">
                                <option v-for="type in BLOG_BOX_TYPES" :key="type.id" :value="type.id">
                                    {{ type.label }}
                                </option>
                            </select>
                        </label>
                        <label class="block text-sm">
                            <span class="mb-1 block font-medium text-gray-700">Label</span>
                            <input v-model="form.title" type="text" class="w-full rounded-md border-gray-300 text-sm" maxlength="80">
                        </label>
                    </div>

                    <label class="block text-sm">
                        <span class="mb-1 block font-medium text-gray-700">Body</span>
                        <textarea
                            v-model="form.body"
                            rows="4"
                            class="w-full rounded-md border-gray-300 text-sm"
                            placeholder="Callout text..."
                        ></textarea>
                    </label>

                    <fieldset>
                        <legend class="mb-2 text-sm font-medium text-gray-700">Theme</legend>
                        <div class="flex flex-wrap gap-2">
                            <label
                                v-for="theme in themes"
                                :key="theme.id"
                                class="flex cursor-pointer items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="form.theme === theme.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'"
                            >
                                <input v-model="form.theme" type="radio" class="sr-only" :value="theme.id">
                                <span
                                    class="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                                    :style="{ background: theme.css.title }"
                                ></span>
                                {{ theme.label }}
                            </label>
                        </div>
                    </fieldset>

                    <div class="grid gap-3 sm:grid-cols-2">
                        <label class="block text-sm">
                            <span class="mb-1 block font-medium text-gray-700">Border</span>
                            <select v-model="form.border" class="w-full rounded-md border-gray-300 text-sm">
                                <option value="solid">Solid</option>
                                <option value="strong">Strong</option>
                                <option value="none">None</option>
                            </select>
                        </label>
                        <label class="block text-sm">
                            <span class="mb-1 block font-medium text-gray-700">Corners</span>
                            <select v-model="form.rounded" class="w-full rounded-md border-gray-300 text-sm">
                                <option value="xl">Rounded</option>
                                <option value="2xl">More rounded</option>
                                <option value="none">Square</option>
                            </select>
                        </label>
                        <label class="flex items-center gap-2 text-sm text-gray-700">
                            <input v-model="form.gradient" type="checkbox" class="rounded border-gray-300">
                            Gradient background
                        </label>
                        <label class="flex items-center gap-2 text-sm text-gray-700">
                            <input v-model="form.shadow" type="checkbox" class="rounded border-gray-300">
                            Shadow
                        </label>
                    </div>

                    <div class="rounded-lg border border-gray-200 p-3">
                        <div class="flex items-center justify-between gap-3">
                            <p class="text-sm font-medium text-gray-700">Image</p>
                            <div class="flex gap-2">
                                <label class="cursor-pointer rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200">
                                    {{ form.imageUrl ? 'Replace image' : 'Add image' }}
                                    <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="onImageFile">
                                </label>
                                <button
                                    v-if="form.imageUrl"
                                    type="button"
                                    class="rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                    @click="removeImage"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <p v-if="uploading" class="mt-2 text-xs text-gray-500">Uploading…</p>
                        <p v-if="uploadError" class="mt-2 text-xs text-red-600">{{ uploadError }}</p>

                        <div v-if="form.imageUrl" class="mt-3 space-y-3">
                            <label class="block text-sm">
                                <span class="mb-1 block font-medium text-gray-700">Alt text</span>
                                <input v-model="form.imageAlt" type="text" class="w-full rounded-md border-gray-300 text-sm">
                            </label>
                            <div class="grid gap-3 sm:grid-cols-2">
                                <label class="block text-sm">
                                    <span class="mb-1 block font-medium text-gray-700">Position</span>
                                    <select v-model="form.imagePosition" class="w-full rounded-md border-gray-300 text-sm">
                                        <option v-for="position in BLOG_BOX_IMAGE_POSITIONS" :key="position.id" :value="position.id">
                                            {{ position.label }}
                                        </option>
                                    </select>
                                </label>
                                <label class="block text-sm">
                                    <span class="mb-1 block font-medium text-gray-700">Max width</span>
                                    <select v-model="form.imageMaxWidth" class="w-full rounded-md border-gray-300 text-sm">
                                        <option v-for="width in BLOG_BOX_IMAGE_WIDTHS" :key="width.id" :value="width.id">
                                            {{ width.label }}
                                        </option>
                                    </select>
                                </label>
                            </div>
                            <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
                                <label class="flex items-center gap-2">
                                    <input v-model="form.imageBorder" type="checkbox" class="rounded border-gray-300">
                                    Border
                                </label>
                                <label class="flex items-center gap-2">
                                    <input v-model="form.imageShadow" type="checkbox" class="rounded border-gray-300">
                                    Shadow
                                </label>
                                <label class="flex items-center gap-2">
                                    <input v-model="form.imageLazy" type="checkbox" class="rounded border-gray-300">
                                    Lazy load
                                </label>
                                <label class="flex items-center gap-2">
                                    <select v-model="form.imageRounded" class="rounded-md border-gray-300 py-1 text-xs">
                                        <option value="2xl">Rounded image</option>
                                        <option value="xl">Slightly rounded</option>
                                        <option value="none">Square image</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
                    <div class="blog-box-preview rounded-lg border border-gray-100 bg-white p-3">
                        <component :is="'style'">{{ previewCss }}</component>
                        <div v-html="previewHtml"></div>
                    </div>
                </div>
            </div>

            <p v-if="formError" class="mt-4 text-sm text-red-600">{{ formError }}</p>

            <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                    v-if="isEdit"
                    type="button"
                    class="text-sm font-semibold text-red-600 hover:text-red-700"
                    @click="emit('remove')"
                >
                    Delete box
                </button>
                <span v-else></span>
                <div class="flex gap-2">
                    <SecondaryButton type="button" @click="close">Cancel</SecondaryButton>
                    <PrimaryButton type="submit">
                        {{ isEdit ? 'Update box' : 'Insert box' }}
                    </PrimaryButton>
                </div>
            </div>
        </form>
    </Modal>
</template>

<style scoped>
.blog-box-preview :deep(aside) {
    max-width: 100%;
}

.blog-box-preview :deep(aside img) {
    max-width: 100%;
    height: auto;
}
</style>
