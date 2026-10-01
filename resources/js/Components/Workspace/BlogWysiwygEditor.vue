<script setup>
import { nextTick, ref, watch } from 'vue';

import Editor from '@tinymce/tinymce-vue';
import BlogBoxModal from '@/Components/Workspace/BlogBoxModal.vue';
import {
    BLOG_BOX_TAILWIND_SAFELIST,
    blogBoxEditorCss,
    buildBlogBoxHtml,
    expandBlogBoxHtml,
    parseBlogBox,
} from '@/utils/blogBox';

import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/wordcount';

import 'tinymce/skins/ui/oxide/skin.min.css';

import axios from 'axios';

window.tinymce = tinymce;

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },

    placeholder: {
        type: String,
        default: 'Write your blog content here...',
    },
});

const emit = defineEmits(['update:modelValue']);

const uploadError = ref('');
const boxUploading = ref(false);
const mode = ref('visual');
const textDraft = ref(props.modelValue ?? '');
const editorInstance = ref(null);
const boxModal = ref({
    open: false,
    mode: 'insert',
    values: null,
});
const editingAside = ref(null);

void BLOG_BOX_TAILWIND_SAFELIST;

function selectedAside(editor) {
    const node = editor?.selection?.getNode?.();
    if (!node) {
        return null;
    }

    return editor.dom.getParent(node, 'aside');
}

function markAsidesReadonly(editor) {
    editor?.dom?.select?.('aside').forEach((el) => {
        if (el.closest?.('.mce-offscreen-selection')) {
            return;
        }

        el.setAttribute('contenteditable', 'false');
        el.setAttribute('data-mce-contenteditable', 'false');

        Array.from(el.children).forEach((child) => {
            if (child.nodeName === 'FIGURE') {
                child.setAttribute('contenteditable', 'false');
                child.setAttribute('data-mce-contenteditable', 'false');
                return;
            }

            child.setAttribute('contenteditable', 'true');
            child.setAttribute('data-mce-contenteditable', 'true');
        });

        el.querySelectorAll('figure, picture, img').forEach((media) => {
            media.setAttribute('contenteditable', 'false');
            media.setAttribute('data-mce-contenteditable', 'false');
        });
    });
}


function stripEditorOnlyAttrs(html) {
    return String(html ?? '')
        // Remove TinyMCE editor-only attributes
        .replace(/\scontenteditable="[^"]*"/gi, '')
        .replace(/\sdata-mce-[a-z0-9-]+="[^"]*"/gi, '')

        // Remove TinyMCE visual caret elements
        .replace(
            /<span\b[^>]*class=["'][^"']*\bmce-visual-caret(?:-hidden)?\b[^"']*["'][^>]*>\s*<\/span>/gi,
            ''
        );
}

function figureRoot(root) {
    return root?.body || root;
}

function figureDocument(root) {
    if (root?.createElement) {
        return root;
    }

    return root?.body ? root : root?.ownerDocument || document;
}

/**
 * Keep figure = image + optional caption only.
 * Never throw: editor tools (Box, image, paste) must keep working.
 */
function normalizeEditorFigures(root) {
    const scope = figureRoot(root);
    if (!scope?.querySelectorAll) {
        return;
    }

    try {
        const doc = figureDocument(root);
        const keep = { IMG: true, PICTURE: true, SOURCE: true, FIGCAPTION: true };

        scope.querySelectorAll('figure picture').forEach((picture) => {
            if (picture.closest('aside')) {
                return;
            }

            const image = picture.querySelector('img');
            if (image) {
                picture.replaceWith(image);
            }
        });

        scope.querySelectorAll('figure').forEach((figure) => {
            if (figure.closest('aside') || !figure.parentNode) {
                return;
            }

            const move = [];

            [...figure.childNodes].forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (String(node.textContent || '').trim()) {
                        move.push(node);
                    }
                    return;
                }

                if (node.nodeType === Node.ELEMENT_NODE && !keep[node.nodeName]) {
                    move.push(node);
                }
            });

            move.reverse().forEach((node) => {
                figure.parentNode.insertBefore(node, figure.nextSibling);
            });

            if (!figure.nextElementSibling) {
                const paragraph = doc.createElement('p');
                paragraph.appendChild(doc.createElement('br'));
                figure.parentNode.insertBefore(paragraph, figure.nextSibling);
            }
        });
    } catch {
        // Leave HTML unchanged rather than breaking the editor.
    }
}

function stripEditorDomArtifacts(html) {
    const source = String(html ?? '');

    if (!source || typeof DOMParser === 'undefined') {
        return source;
    }

    const doc = new DOMParser().parseFromString(source, 'text/html');

    doc.querySelectorAll(
        '.mce-offscreen-selection, .mce-visual-caret, .mce-visual-caret-hidden',
    ).forEach((el) => el.remove());

    normalizeEditorFigures(doc);

    return doc.body.innerHTML;
}

function openBoxModal(editor) {
    const aside = selectedAside(editor);
    editingAside.value = aside || null;

    boxModal.value = {
        open: true,
        mode: aside ? 'edit' : 'insert',
        values: aside ? parseBlogBox(aside) : null,
    };
}

function closeBoxModal() {
    editingAside.value = null;
    boxModal.value = {
        open: false,
        mode: 'insert',
        values: null,
    };
}

function parseAsideElement(editor, html) {
    const doc = editor.getDoc();
    const wrap = doc.createElement('div');
    wrap.innerHTML = html;
    return wrap.querySelector('aside');
}

function applyBoxHtml(html) {
    const editor = editorInstance.value;
    if (!editor) {
        return;
    }

    const aside = parseAsideElement(editor, html);
    if (!aside) {
        return;
    }

    const existing = editingAside.value;
    const replace = Boolean(
        existing && editor.getBody?.().contains?.(existing),
    );

    editor.focus();
    editor.undoManager.transact(() => {
        if (replace) {
            existing.replaceWith(aside);
        } else {
            const selected = editor.selection.getNode();
            const block = editor.dom.getParent(
                selected,
                (node) => node !== editor.getBody() && editor.dom.isBlock(node),
            );

            if (block) {
                editor.dom.insertAfter(aside, block);
            } else {
                editor.getBody().appendChild(aside);
            }

            const spacer = editor.dom.create('p', {}, '');
            spacer.appendChild(editor.dom.create('br'));
            editor.dom.insertAfter(spacer, aside);
        }

        markAsidesReadonly(editor);
        editor.selection.select(aside);
        editor.nodeChanged();
    });

    editor.dispatch('change');
    onEditorInput(editor.getContent({ format: 'html' }));
}

function saveBox(config) {
    applyBoxHtml(buildBlogBoxHtml(config));
    closeBoxModal();
}

function removeBox() {
    const editor = editorInstance.value;
    const existing = editingAside.value || selectedAside(editor);
    if (editor && existing && editor.getBody?.().contains?.(existing)) {
        editor.undoManager.transact(() => {
            editor.dom.remove(existing);
        });
        editor.dispatch('change');
        onEditorInput(editor.getContent({ format: 'html' }));
    }
    closeBoxModal();
}

async function uploadBoxImage(file, done) {
    if (!file) {
        return;
    }

    boxUploading.value = true;
    uploadError.value = '';

    try {
        const url = await uploadImage({
            blob: () => file,
            filename: () => file.name || 'box-image.png',
        });
        done?.(url);
    } catch {
        // uploadImage already records uploadError
    } finally {
        boxUploading.value = false;
    }
}

/**
 * Clean editor HTML.
 *
 * Rules:
 *
 * 1. Empty paragraphs become <p><br></p>
 * 2. Remove unwanted <span>&nbsp;</span>
 * 3. Convert NBSP to normal spaces
 * 4. Remove empty spans
 * 5. Remove orphan <figure> elements that contain no image
 *
 * An orphan figure looks like:
 *
 * <figure>
 *     <figcaption>Some caption</figcaption>
 * </figure>
 *
 * This must NOT exist when no image is inside it.
 */
function cleanEditorHtml(html) {
    if (!html) {
        return '';
    }

    let cleaned = stripEditorOnlyAttrs(stripEditorDomArtifacts(html));

    /**
     * Remove orphan figures.
     *
     * A valid image figure must contain an <img>.
     *
     * This removes:
     *
     * <figure>
     *     <figcaption>...</figcaption>
     * </figure>
     */
    cleaned = cleaned.replace(
        /<figure\b([^>]*)>(?![\s\S]*?<img\b)[\s\S]*?<\/figure>/gi,
        '',
    );

    /**
     * Drop empty captions. A caption bar should appear only when the
     * image dialog "Show caption" checkbox is checked and has text.
     */
    cleaned = cleaned.replace(
        /<figcaption\b[^>]*>\s*(?:&nbsp;|\u00a0|<br\s*\/?>)*\s*<\/figcaption>/gi,
        '',
    );

    /**
     * Convert empty paragraphs into visible blank paragraphs.
     *
     * <p></p>
     *
     * becomes:
     *
     * <p><br></p>
     */
    cleaned = cleaned.replace(
        /<p\b([^>]*)>\s*<\/p>/gi,
        '<p$1><br></p>',
    );

    /**
     * Remove spans containing only NBSP.
     *
     * <span>&nbsp;</span>
     *
     * becomes:
     *
     * normal space
     */
    cleaned = cleaned.replace(
        /<span\b[^>]*>\s*(?:&nbsp;|\u00a0)\s*<\/span>/gi,
        ' ',
    );

    /**
     * Convert remaining NBSP entities.
     */
    cleaned = cleaned.replace(/&nbsp;/gi, ' ');

    /**
     * Convert actual NBSP characters.
     */
    cleaned = cleaned.replace(/\u00a0/g, ' ');

    /**
     * Remove empty spans.
     */
    cleaned = cleaned.replace(
        /<span\b[^>]*>\s*<\/span>/gi,
        '',
    );

    return cleaned;
}

/**
 * Keep Text mode synchronized with external modelValue.
 */
watch(
    () => props.modelValue,
    (value) => {
        const html = cleanEditorHtml(value ?? '');

        if (mode.value === 'text' && html !== textDraft.value) {
            textDraft.value = html;
        }
    },
);

/**
 * Get Laravel XSRF token.
 */
function getXsrfToken() {
    const raw = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1] ?? '';

    return raw ? decodeURIComponent(raw) : '';
}

/**
 * Upload image to Laravel.
 */
async function uploadImage(blobInfo) {
    uploadError.value = '';

    const body = new FormData();

    body.append(
        'image',
        blobInfo.blob(),
        blobInfo.filename(),
    );

    try {
        const { data } = await axios.post(
            route('blogs.upload-image'),
            body,
            {
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getXsrfToken(),
                },
            },
        );

        if (!data?.url) {
            throw new Error('Image upload failed.');
        }

        return data.url;
    } catch (error) {
        const message =
            error?.response?.data?.errors?.image?.[0]
            || error?.response?.data?.message
            || error?.message
            || 'Image upload failed.';

        uploadError.value = message;

        throw new Error(message);
    }
}

/**
 * TinyMCE configuration.
 */
const init = {
    license_key: 'gpl',

    height: 480,

    menubar: false,
    branding: false,
    promotion: false,
    schema: 'html5',

    statusbar: true,

    /**
     * Hide:
     *
     * figure > figcaption
     *
     * from TinyMCE bottom status bar.
     */
    elementpath: false,

    resize: true,

    skin: false,
    content_css: false,

    content_style: `
        body {
            font-family: Figtree, ui-sans-serif, system-ui, sans-serif;
            font-size: 14px;
            line-height: 1.625;
            color: #1f2937;
            padding: 12px 16px;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.25rem 0 0.75rem;
            color: #111827;
        }

        h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 1.25rem 0 0.75rem;
            color: #111827;
        }

        h3 {
            font-size: 1.05rem;
            font-weight: 700;
            margin: 1rem 0 0.5rem;
            color: #111827;
        }

        p {
            margin: 0 0 0.9rem;
        }

        ul {
            margin: 0 0 0.9rem;
            padding-left: 1.25rem;
            list-style: disc;
        }

        ol {
            margin: 0 0 0.9rem;
            padding-left: 1.25rem;
            list-style: decimal;
        }

        li {
            margin: 0.25rem 0;
        }

        blockquote {
            margin: 0 0 0.9rem;
            border-left: 4px solid #3b82f6;
            background: rgba(239, 246, 255, 0.5);
            padding: 0.75rem 1rem;
            font-style: italic;
            color: #374151;
        }

        a {
            color: #2563eb;
            text-decoration: underline;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        figure {
            display: block;
            width: 100%;
            margin: 2rem 0;
            padding: 0;
            overflow: visible;
            border: 0;
            background: transparent;
            box-shadow: none;
        }

        figure:has(figcaption) {
            overflow: hidden;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            background: #ffffff;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        figure picture,
        figure img {
            display: block;
            width: 100%;
            max-width: 100%;
            height: auto;
            margin: 0;
            border: 0;
            border-radius: 0;
        }

        figure:has(figcaption) picture,
        figure:has(figcaption) img {
            border-radius: 0;
        }

        figure figcaption {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 0.75rem 1rem;
            border-top: 1px solid #f3f4f6;
            background: #f9fafb;
            text-align: center;
            font-size: 0.875rem;
            line-height: 1.625;
            color: #6b7280;
        }

        figure figcaption:empty {
            display: none;
            padding: 0;
            border: 0;
            background: transparent;
        }

        hr {
            margin: 1.5rem 0;
            border: 0;
            border-top: 1px solid #e5e7eb;
        }

        ${blogBoxEditorCss()}
    `,

    plugins:
        'advlist autolink lists link image charmap searchreplace quickbars wordcount',

    toolbar:
        'undo redo | blocks | bold italic underline strikethrough | ' +
        'forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | ' +
        'blockquote link image blogbox hr | removeformat',

    block_formats:
        'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',

    toolbar_mode: 'wrap',

    placeholder: props.placeholder,

    link_default_protocol: 'https',
    link_assume_external_targets: true,

    /**
     * IMAGE DIALOG
     *
     * Alternative description = ALT attribute.
     *
     * Show caption = optional.
     *
     * Caption is NOT automatically selected.
     */
    image_title: true,
    image_description: true,
    image_caption: true,
    image_dimensions: false,

    automatic_uploads: true,
    images_reuse_filename: false,
    images_file_types: 'jpg,jpeg,png,webp',

    file_picker_types: 'image',

    images_upload_handler: uploadImage,

    quickbars_insert_toolbar: false,

    quickbars_selection_toolbar:
        'bold italic underline | quicklink h2 blockquote',

    quickbars_image_toolbar:
        'alignleft aligncenter alignright | remove',

    object_resizing: 'img',

    paste_as_text: false,
    paste_block_drop: false,
    paste_data_images: true,
    paste_merge_formats: true,
    paste_tab_spaces: 4,
    smart_paste: true,

    convert_urls: false,
    relative_urls: false,
    remove_script_host: false,

    /**
     * TinyMCE setup.
     */
    setup(editor) {
        editor.ui.registry.addIcon(
            'blog-box',
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 9.5h10M7 12.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        );

        editor.ui.registry.addButton('blogbox', {
            tooltip: 'Insert / edit box',
            text: 'Box',
            icon: 'blog-box',
            onAction: () => {
                window.setTimeout(() => openBoxModal(editor), 0);
            },
        });

        editor.ui.registry.addButton('blogboxedit', {
            tooltip: 'Edit box',
            icon: 'blog-box',
            onAction: () => openBoxModal(editor),
        });

        editor.ui.registry.addButton('blogboxremove', {
            tooltip: 'Delete box',
            icon: 'remove',
            onAction: () => {
                editingAside.value = selectedAside(editor);
                removeBox();
            },
        });

        editor.ui.registry.addContextToolbar('blogbox', {
            predicate: (node) => Boolean(editor.dom.getParent(node, 'aside')),
            items: 'blogboxedit blogboxremove',
            position: 'node',
            scope: 'node',
        });

        editor.on('dblclick', (event) => {
            const aside = editor.dom.getParent(event.target, 'aside');
            if (aside) {
                editor.selection.select(aside);
                openBoxModal(editor);
            }
        });

        editor.on('SetContent', () => {
            normalizeEditorFigures(editor.getBody());
            markAsidesReadonly(editor);
        });

        editor.on('init', () => {
            normalizeEditorFigures(editor.getBody());
            markAsidesReadonly(editor);
        });

        editor.on('PastePostProcess', () => {
            normalizeEditorFigures(editor.getBody());
        });

        editor.on('keydown', (event) => {
            if (event.keyCode !== 13) {
                return;
            }

            const node = editor.selection.getNode();
            const caption = editor.dom.getParent(node, 'figcaption');
            const figure = caption ? editor.dom.getParent(caption, 'figure') : null;
            if (!figure || figure.closest?.('aside')) {
                return;
            }

            event.preventDefault();

            let next = figure.nextElementSibling;
            if (!next || next.nodeName !== 'P') {
                next = editor.dom.create('p', {}, '');
                next.appendChild(editor.dom.create('br'));
                editor.dom.insertAfter(next, figure);
            }

            editor.selection.setCursorLocation(next, 0);
        });

        editor.on('BeforeSetContent', (event) => {
            if (typeof event.content === 'string') {
                event.content = expandBlogBoxHtml(event.content);
            }
        });

        editor.on('GetContent', (event) => {
            // Copy/paste and selection snapshots must stay untouched.
            // Cleaning here strips TinyMCE bookmarks (data-mce-*, markers)
            // so Ctrl+C / Ctrl+V appear to do nothing.
            if (
                event.selection
                || event.source_view
                || event.paste
                || event.format === 'raw'
                || event.format === 'tree'
                || event.format === 'text'
            ) {
                return;
            }

            if (typeof event.content === 'string') {
                event.content = stripEditorOnlyAttrs(cleanEditorHtml(event.content));
            }
        });

        editor.on('PreInit', () => {
            editor.schema.addValidChildren?.('+body[aside]');
            editor.schema.addValidChildren?.('+aside[div|p|figure|picture|img|ul|ol|blockquote|h2|h3|h4|br|strong|em|span|a|source]');
        });
    },

    /**
     * IMPORTANT:
     *
     * span is intentionally NOT allowed.
     *
     * This prevents:
     *
     * <span>&nbsp;</span>
     *
     * from being generated/preserved.
     */
    valid_elements:
        'h1[style],h2[style],h3[style],h4[style],h5[style],h6[style],' +
        'p[class|style],br,strong/b,em/i,u,s,strike,' +
        'a[href|target|rel|title],' +
        'ul[style],ol[style],li[style],blockquote[style],' +
        'div[class|style],' +
        'aside[*],' +
        'figure[class|style],' +
        'picture[class],' +
        'span[style],' +
        'source[srcset|type|media],' +
        'figcaption[class|style],' +
        'img[src|alt|title|width|height|class|style|loading|decoding],' +
        'hr',

    extended_valid_elements:
        'aside[*],div[class|style],picture[class],p[class|style],figure[class|style],' +
        'img[src|alt|title|width|height|class|style|loading|decoding]',

    valid_children:
        '+body[aside],-p[aside],+div[p|figure|picture|img|div|br|strong|em|span|a],' +
        '+aside[div|p|figure|picture|img|ul|ol|blockquote|h2|h3|h4|br|strong|em|span|a|source],' +
        '+figure[picture|img|figcaption|source],+picture[img|source]',

    valid_styles: {
        '*': 'text-align,color,background-color',

        span:
            'color,background-color,font-weight,font-style,text-decoration',

        img:
            'width,height,max-width,float,margin,margin-left,margin-right,display,' +
            'object-fit,object-position',

        figure:
            'width,margin,margin-top,margin-right,margin-bottom,margin-left,' +
            'padding,overflow,border,border-top,border-right,border-bottom,' +
            'border-left,border-radius,background,background-color,box-shadow,' +
            'text-align',

        figcaption:
            'width,box-sizing,margin,margin-top,margin-right,margin-bottom,margin-left,' +
            'padding,border,border-top,border-right,border-bottom,border-left,' +
            'border-radius,background,background-color,text-align,' +
            '            color,font-size,line-height',
    },

    formats: {
        alignleft: [
            {
                selector:
                    'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,blockquote',

                styles: {
                    textAlign: 'left',
                },
            },

            {
                selector: 'img',

                styles: {
                    float: 'left',
                    margin: '0.75rem 1rem 0.75rem 0',
                    display: 'inline-block',
                },
            },
        ],

        aligncenter: [
            {
                selector:
                    'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,blockquote',

                styles: {
                    textAlign: 'center',
                },
            },

            {
                selector: 'img',

                styles: {
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    float: 'none',
                },
            },
        ],

        alignright: [
            {
                selector:
                    'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,blockquote',

                styles: {
                    textAlign: 'right',
                },
            },

            {
                selector: 'img',

                styles: {
                    float: 'right',
                    margin: '0.75rem 0 0.75rem 1rem',
                    display: 'inline-block',
                },
            },
        ],

        alignjustify: {
            selector:
                'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,blockquote',

            styles: {
                textAlign: 'justify',
            },
        },
    },
};

/**
 * TinyMCE initialized.
 */
function onEditorInit(_event, editor) {
    editorInstance.value = editor;
}

/**
 * Visual editor input.
 */
function onEditorInput(value) {
    const cleanedHtml = cleanEditorHtml(value ?? '');

    emit('update:modelValue', cleanedHtml);
}

/**
 * Switch Visual/Text.
 */
async function setMode(next) {
    if (next === mode.value) {
        return;
    }

    /**
     * Visual -> Text
     */
    if (next === 'text') {
        const html = cleanEditorHtml(
            editorInstance.value?.getContent?.()
            ?? props.modelValue
            ?? '',
        );

        textDraft.value = html;

        emit('update:modelValue', html);

        mode.value = 'text';

        return;
    }

    /**
     * Text -> Visual
     */
    const html = cleanEditorHtml(textDraft.value ?? '');

    textDraft.value = html;

    emit('update:modelValue', html);

    mode.value = 'visual';

    await nextTick();

    if (editorInstance.value) {
        editorInstance.value.setContent(html);

        editorInstance.value.dispatch('ResizeEditor');
    }
}

/**
 * Text editor input.
 */
function onTextInput(event) {
    const value = event?.target?.value ?? '';

    const cleanedValue = cleanEditorHtml(value);

    textDraft.value = cleanedValue;

    emit('update:modelValue', cleanedValue);
}
</script>

<template>
    <div
        class="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
    >
        <!-- Visual / Text -->
        <div
            class="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5"
        >
            <button
                type="button"
                class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                :class="
                    mode === 'visual'
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-800'
                "
                @click="setMode('visual')"
            >
                Visual
            </button>

            <button
                type="button"
                class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                :class="
                    mode === 'text'
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-800'
                "
                @click="setMode('text')"
            >
                Text
            </button>

            <p class="ml-2 hidden text-[11px] text-gray-400 sm:block">
                {{
                    mode === 'visual'
                        ? 'WYSIWYG editing'
                        : 'Edit HTML source directly'
                }}
            </p>
        </div>

        <!-- Visual editor -->
        <div v-show="mode === 'visual'">
            <Editor
                :model-value="modelValue"
                license-key="gpl"
                :init="init"
                @init="onEditorInit"
                @update:model-value="onEditorInput"
            />
        </div>

        <!-- Text editor -->
        <textarea
            v-show="mode === 'text'"
            :value="textDraft"
            class="block min-h-[480px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none focus:ring-0"
            spellcheck="false"
            aria-label="Blog content HTML"
            @input="onTextInput"
        ></textarea>

        <!-- Upload error -->
        <p
            v-if="uploadError"
            class="border-t border-gray-100 px-4 py-2 text-sm text-red-600"
        >
            {{ uploadError }}
        </p>

        <Teleport to="body">
            <BlogBoxModal
                :show="boxModal.open"
                :mode="boxModal.mode"
                :values="boxModal.values"
                :uploading="boxUploading"
                :upload-error="uploadError"
                @close="closeBoxModal"
                @save="saveBox"
                @remove="removeBox"
                @upload="uploadBoxImage"
            />
        </Teleport>
    </div>
</template>

<style scoped>
:deep(.tox-tinymce) {
    border: none !important;
    border-radius: 0 !important;
}

:deep(.tox-editor-header) {
    box-shadow: none !important;
    border-bottom: 1px solid #e5e7eb !important;
    padding: 0.25rem 0.25rem 0 !important;
}

:deep(.tox .tox-toolbar__primary) {
    background: #f9fafb !important;
}

:deep(.tox-statusbar) {
    border-top: 1px solid #f3f4f6 !important;
}
</style>
