<script setup>
import { computed, ref, watch } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import WorkspaceLayout from '@/Layouts/WorkspaceLayout.vue';
import BlogWysiwygEditor from '@/Components/Workspace/BlogWysiwygEditor.vue';
import AddBlogCategoryModal from '@/Components/Workspace/AddBlogCategoryModal.vue';
import InputError from '@/Components/InputError.vue';

const props = defineProps({
    mode: { type: String, default: 'create' }, // create | edit
    blog: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    statuses: { type: Array, default: () => [] },
    relatedOptions: { type: Array, default: () => [] },
    defaults: { type: Object, default: () => ({}) },
});

const page = usePage();
const localCategories = ref([...props.categories]);
const showCategoryModal = ref(false);
const slugManual = ref(props.mode === 'edit');
const coverPreview = ref(props.blog?.cover_image || null);
const tagsInput = ref(Array.isArray(props.blog?.tags) ? props.blog.tags.join(', ') : '');
const keywordsInput = ref(Array.isArray(props.blog?.keywords) ? props.blog.keywords.join(', ') : '');

watch(() => props.categories, (value) => {
    localCategories.value = [...value];
});

function parseList(value) {
    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function faqItemsFromBlog(blog) {
    if (!Array.isArray(blog?.faq)) return [];
    return blog.faq.map((item, index) => ({
        _id: `faq_${index}`,
        question: item.question || '',
        answer: item.answer || '',
    }));
}

const form = useForm({
    title: props.blog?.title || '',
    slug: props.blog?.slug || '',
    excerpt: props.blog?.excerpt || '',
    content: typeof props.blog?.content === 'string' ? props.blog.content : '',
    blog_category_id: props.blog?.blog_category_id || '',
    status: props.blog?.status || props.defaults.status || 'draft',
    published_at: props.blog?.published_at || '',
    reading_time: props.blog?.reading_time || null,
    featured: !!props.blog?.featured,
    popular: !!props.blog?.popular,
    tags: Array.isArray(props.blog?.tags) ? [...props.blog.tags] : [],
    keywords: Array.isArray(props.blog?.keywords) ? [...props.blog.keywords] : [],
    faq: faqItemsFromBlog(props.blog),
    related_ids: Array.isArray(props.blog?.related_ids) ? props.blog.related_ids.map(Number) : [],
    cover_image: null,
    remove_cover: false,
});

/** Author is always the authenticated admin — not selectable. */
const publicAuthor = computed(() => {
    if (props.blog?.author) {
        return props.blog.author;
    }
    if (props.defaults?.author) {
        return props.defaults.author;
    }

    const user = page.props.auth?.user;
    if (!user?.name) {
        return null;
    }

    const parts = String(user.name).trim().split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('') || 'U';

    return {
        name: user.name,
        role: user.role === 'admin' ? 'Admin' : 'Author',
        initials,
        avatarBg: 'bg-blue-600',
        bio: '',
    };
});

watch(() => form.title, (title) => {
    if (slugManual.value) return;
    form.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
});

function onSlugInput() {
    slugManual.value = true;
}

function onCategoryCreated(category) {
    localCategories.value = [...localCategories.value, category].sort((a, b) => a.name.localeCompare(b.name));
    form.blog_category_id = category.id;
}

function onCoverChange(event) {
    const file = event.target.files?.[0] || null;
    form.cover_image = file;
    form.remove_cover = false;
    if (file) {
        coverPreview.value = URL.createObjectURL(file);
    }
}

function clearCover() {
    form.cover_image = null;
    form.remove_cover = true;
    coverPreview.value = null;
}

function addFaq() {
    form.faq = [
        ...form.faq,
        { _id: `faq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, question: '', answer: '' },
    ];
}

function removeFaq(index) {
    form.faq = form.faq.filter((_, i) => i !== index);
}

function moveFaq(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= form.faq.length) return;
    const next = [...form.faq];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    form.faq = next;
}

const relatedPick = ref('');

function addRelated(id) {
    const nid = Number(id);
    if (!nid) return;
    const current = form.related_ids.map(Number);
    if (current.includes(nid) || current.length >= 3) return;
    form.related_ids = [...current, nid];
}

function removeRelated(id) {
    const nid = Number(id);
    form.related_ids = form.related_ids.map(Number).filter((value) => value !== nid);
}

watch(relatedPick, (id) => {
    if (!id) return;
    addRelated(id);
    relatedPick.value = '';
});

const selectedRelated = computed(() => {
    const ids = form.related_ids.map(Number);
    return ids.map((id) => props.relatedOptions.find((option) => Number(option.id) === id)).filter(Boolean);
});

const availableRelatedOptions = computed(() => {
    const selected = form.related_ids.map(Number);
    return props.relatedOptions.filter((option) => !selected.includes(Number(option.id)));
});

const relatedSelectDisabled = computed(() => form.related_ids.length >= 3 || !availableRelatedOptions.value.length);

const pageTitle = computed(() => (props.mode === 'edit' ? 'Edit Blog' : 'Create New Blog'));

function estimateReadingTime() {
    const text = String(form.content || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    form.reading_time = Math.max(1, Math.ceil(words / 200) || 1);
}

function submit(statusOverride = null) {
    estimateReadingTime();
    form.tags = parseList(tagsInput.value);
    form.keywords = parseList(keywordsInput.value);

    if (statusOverride) {
        form.status = statusOverride;
        if (statusOverride === 'published' && !form.published_at) {
            form.published_at = new Date().toISOString().slice(0, 10);
        }
    }

    const payload = {
        ...form.data(),
        content: form.content || '',
        faq: JSON.stringify(form.faq.map(({ question, answer }) => ({
            question: String(question || '').trim(),
            answer: String(answer || '').trim(),
        }))),
        tags: JSON.stringify(form.tags),
        keywords: JSON.stringify(form.keywords),
        related_ids: JSON.stringify(form.related_ids.map(Number).filter(Boolean).slice(0, 3)),
        blog_category_id: form.blog_category_id ? Number(form.blog_category_id) : null,
        reading_time: form.reading_time ? Number(form.reading_time) : null,
        featured: form.featured ? 1 : 0,
        popular: form.popular ? 1 : 0,
        remove_cover: form.remove_cover ? 1 : 0,
    };

    if (props.mode === 'edit') {
        form.transform(() => ({ ...payload, _method: 'put' }))
            .post(route('blogs.update', props.blog.id), { forceFormData: true });
        return;
    }

    form.transform(() => payload)
        .post(route('blogs.store'), { forceFormData: true });
}
</script>

<template>
    <WorkspaceLayout>
        <template #header>{{ pageTitle }}</template>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <Link :href="route('blogs.index')" class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Blogs
                </Link>
                <h1 class="mt-2 text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
                <p class="mt-1 text-sm text-gray-500">Write and manage your blog content, FAQs, metadata, and publishing details.</p>
            </div>
        </div>

        <form class="space-y-6 pb-24" @submit.prevent="submit()">
            <!-- Section 1: Blog Details -->
            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-5 py-4">
                    <h2 class="text-sm font-semibold text-gray-900">Blog Details</h2>
                </div>
                <div class="grid gap-5 p-5 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
                        <input
                            v-model="form.title"
                            type="text"
                            placeholder="How to Sign a PDF Online"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <InputError class="mt-1.5" :message="form.errors.title" />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            v-model="form.slug"
                            type="text"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @input="onSlugInput"
                        />
                        <InputError class="mt-1.5" :message="form.errors.slug" />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                        <select
                            v-model="form.blog_category_id"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option v-for="c in localCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                        <button
                            type="button"
                            class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            @click="showCategoryModal = true"
                        >
                            + Add Category
                        </button>
                        <InputError class="mt-1.5" :message="form.errors.blog_category_id" />
                    </div>

                    <div class="sm:col-span-2">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</label>
                        <textarea
                            v-model="form.excerpt"
                            rows="3"
                            placeholder="Short summary shown on the blog listing…"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <InputError class="mt-1.5" :message="form.errors.excerpt" />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
                        <input
                            v-model="tagsInput"
                            type="text"
                            placeholder="PDF Signing, Tutorial, Getting Started"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p class="mt-1 text-xs text-gray-500">Comma-separated. Shown on cards and the post page.</p>
                        <InputError class="mt-1.5" :message="form.errors.tags" />
                    </div>
                </div>
            </section>

            <!-- Section: Featured Image -->
            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-5 py-4">
                    <h2 class="text-sm font-semibold text-gray-900">Featured Image</h2>
                </div>
                <div class="p-5">
                    <div class="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                        <img
                            v-if="coverPreview && !form.remove_cover"
                            :src="coverPreview"
                            alt=""
                            class="mb-3 max-h-48 w-full rounded-lg object-cover"
                        />
                        <div class="flex flex-wrap items-center gap-2">
                            <label class="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                                <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="onCoverChange" />
                                {{ coverPreview && !form.remove_cover ? 'Replace image' : 'Upload image' }}
                            </label>
                            <button
                                v-if="coverPreview && !form.remove_cover"
                                type="button"
                                class="text-sm font-medium text-red-600 hover:text-red-700"
                                @click="clearCover"
                            >
                                Remove
                            </button>
                        </div>
                        <p class="mt-2 text-xs text-gray-500">JPG, PNG, or WebP up to 5MB. Optional — the public blog falls back to the slug cover when empty.</p>
                    </div>
                    <InputError class="mt-1.5" :message="form.errors.cover_image" />
                </div>
            </section>

            <!-- Section: Content -->
            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-5 py-4">
                    <h2 class="text-sm font-semibold text-gray-900">Content</h2>
                    <p class="mt-0.5 text-xs text-gray-500">
                        Visual or Text editing — format text, align blocks, add links, insert or remove images. Matches the published article.
                    </p>
                </div>
                <div class="p-5">
                    <BlogWysiwygEditor v-model="form.content" />
                    <InputError class="mt-3" :message="form.errors.content" />
                </div>
            </section>

            <!-- Section: FAQ (structured — separate from main content) -->
            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900">Frequently Asked Questions</h2>
                        <p class="mt-0.5 text-xs text-gray-500">Managed separately from main content. Order is preserved on the public post page.</p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        @click="addFaq"
                    >
                        + Add Question
                    </button>
                </div>
                <div class="space-y-4 p-5">
                    <div
                        v-if="form.faq.length === 0"
                        class="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center"
                    >
                        <p class="text-sm font-medium text-gray-800">No FAQ items yet</p>
                        <p class="mt-1 text-sm text-gray-500">Add questions and answers for the public FAQ section.</p>
                        <button
                            type="button"
                            class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                            @click="addFaq"
                        >
                            + Add Question
                        </button>
                    </div>

                    <div
                        v-for="(item, index) in form.faq"
                        :key="item._id"
                        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                        <div class="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                            <p class="text-sm font-semibold text-gray-800">Question {{ index + 1 }}</p>
                            <div class="flex items-center gap-1">
                                <button
                                    type="button"
                                    class="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-800 disabled:opacity-40"
                                    :disabled="index === 0"
                                    @click="moveFaq(index, -1)"
                                >
                                    ↑ Move Up
                                </button>
                                <button
                                    type="button"
                                    class="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-800 disabled:opacity-40"
                                    :disabled="index === form.faq.length - 1"
                                    @click="moveFaq(index, 1)"
                                >
                                    ↓ Move Down
                                </button>
                                <button
                                    type="button"
                                    class="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                    @click="removeFaq(index)"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class="space-y-3 p-4">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">Question</label>
                                <input
                                    v-model="item.question"
                                    type="text"
                                    placeholder="How do I sign a PDF?"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <InputError class="mt-1.5" :message="form.errors[`faq.${index}.question`]" />
                            </div>
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">Answer</label>
                                <textarea
                                    v-model="item.answer"
                                    rows="4"
                                    placeholder="Write the answer…"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <InputError class="mt-1.5" :message="form.errors[`faq.${index}.answer`]" />
                            </div>
                        </div>
                    </div>

                    <button
                        v-if="form.faq.length > 0"
                        type="button"
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                        @click="addFaq"
                    >
                        + Add Question
                    </button>
                    <InputError :message="form.errors.faq" />
                </div>
            </section>

            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 class="text-sm font-semibold text-gray-900">Related articles</h2>
                        <p class="mt-0.5 text-xs text-gray-500">
                            Optional. Pick up to 3 posts for the public “Related articles” box. Leave empty to fall back to the latest published posts in the same category.
                        </p>
                    </div>
                    <button
                        v-if="form.related_ids.length"
                        type="button"
                        class="text-sm font-medium text-red-600 hover:text-red-700"
                        @click="form.related_ids = []"
                    >
                        Remove all
                    </button>
                </div>
                <div class="p-5">
                    <div v-if="selectedRelated.length" class="mb-4 flex flex-wrap gap-2">
                        <span
                            v-for="option in selectedRelated"
                            :key="option.id"
                            class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"
                        >
                            {{ option.title }}
                            <button
                                type="button"
                                class="rounded-full p-0.5 text-blue-600 hover:bg-blue-100 hover:text-blue-900"
                                :aria-label="`Remove ${option.title}`"
                                @click="removeRelated(option.id)"
                            >
                                ×
                            </button>
                        </span>
                    </div>
                    <p v-else class="mb-4 text-sm text-gray-500">
                        No related articles selected.
                    </p>

                    <p v-if="!relatedOptions.length" class="text-sm text-gray-500">
                        No other posts yet. Create another blog first, then you can pick related articles here.
                    </p>
                    <div v-else>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Add related article</label>
                        <select
                            v-model="relatedPick"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                            :disabled="relatedSelectDisabled"
                        >
                            <option value="">
                                {{ form.related_ids.length >= 3 ? 'Maximum of 3 related articles selected' : 'Select a related article' }}
                            </option>
                            <option
                                v-for="option in availableRelatedOptions"
                                :key="option.id"
                                :value="option.id"
                            >
                                {{ option.title }} ({{ option.status }})
                            </option>
                        </select>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">{{ form.related_ids.length }}/3 selected</p>
                    <InputError class="mt-1.5" :message="form.errors.related_ids" />
                </div>
            </section>

            <!-- Section: Status / Publishing -->
            <section class="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div class="border-b border-gray-100 px-5 py-4">
                    <h2 class="text-sm font-semibold text-gray-900">Status / Publishing</h2>
                </div>
                <div class="grid gap-5 p-5 sm:grid-cols-2">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                        <select
                            v-model="form.status"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                        </select>
                        <InputError class="mt-1.5" :message="form.errors.status" />
                    </div>
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">Published date</label>
                        <input
                            v-model="form.published_at"
                            type="date"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <InputError class="mt-1.5" :message="form.errors.published_at" />
                    </div>
                    <div class="sm:col-span-2 flex flex-wrap gap-6">
                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input v-model="form.featured" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            Featured (hero on listing)
                        </label>
                        <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input v-model="form.popular" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            Popular (badge + sidebar)
                        </label>
                    </div>
                </div>
            </section>

            <!-- Sticky actions -->
            <div class="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur">
                <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-end gap-2 px-4 py-3 lg:px-8">
                    <Link
                        :href="route('blogs.index')"
                        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                        :disabled="form.processing"
                        @click="submit('draft')"
                    >
                        {{ form.processing && form.status === 'draft' ? 'Saving…' : 'Save as Draft' }}
                    </button>
                    <button
                        type="button"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                        :disabled="form.processing"
                        @click="submit('published')"
                    >
                        {{ form.processing && form.status === 'published' ? 'Publishing…' : 'Publish' }}
                    </button>
                </div>
            </div>
        </form>

        <AddBlogCategoryModal
            :show="showCategoryModal"
            @close="showCategoryModal = false"
            @created="onCategoryCreated"
        />
    </WorkspaceLayout>
</template>
