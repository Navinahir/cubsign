import { ref, computed, onBeforeUnmount, nextTick } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    splitFilename,
    buildFilename,
    validateFilename,
    isDuplicateName,
} from '@/utils/filename';

export function useDocumentRename(getDocuments) {
    const editingId    = ref(null);
    const editingBase  = ref('');
    const editingExt   = ref('');
    const originalName = ref('');
    const savingId     = ref(null);
    const renameError  = ref('');
    const toast        = ref('');
    const editRootRef  = ref(null);
    const renameComponentRef = ref(null);

    let toastTimer     = null;
    let outsideHandler = null;

    const editingDoc = computed(() => {
        const docs = getDocuments()?.data ?? [];
        return docs.find((d) => d.id === editingId.value) ?? null;
    });

    function showToast(message) {
        toast.value = message;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.value = '';
        }, 3000);
    }

    function detachOutsideListener() {
        if (!outsideHandler) return;
        document.removeEventListener('mousedown', outsideHandler, true);
        outsideHandler = null;
    }

    function attachOutsideListener() {
        detachOutsideListener();
        outsideHandler = (event) => {
            if (editingId.value === null || savingId.value) return;
            if (editRootRef.value?.contains(event.target)) return;
            commitEdit();
        };
        document.addEventListener('mousedown', outsideHandler, true);
    }

    function cancelEdit() {
        editingId.value    = null;
        editingBase.value  = '';
        editingExt.value   = '';
        originalName.value = '';
        renameError.value  = '';
        detachOutsideListener();
    }

    function focusAndSelect() {
        nextTick(() => {
            renameComponentRef.value?.focusInput?.();
        });
    }

    function beginEdit(doc) {
        const { base, ext } = splitFilename(doc.name);
        editingId.value    = doc.id;
        editingBase.value  = base;
        editingExt.value   = ext;
        originalName.value = doc.name;
        renameError.value  = '';
        attachOutsideListener();
        focusAndSelect();
    }

    function buildCurrentName() {
        return buildFilename(editingBase.value, editingExt.value);
    }

    function duplicateWarning(doc) {
        if (editingId.value !== doc.id) return '';
        const name = buildCurrentName();
        if (!name || name === originalName.value) return '';
        const others = (getDocuments()?.data ?? []).filter((d) => d.id !== doc.id);
        return isDuplicateName(name, others) ? 'A document with this name already exists.' : '';
    }

    function saveRename(doc, name, thenStart = null) {
        if (savingId.value) return;

        savingId.value    = doc.id;
        renameError.value = '';
        detachOutsideListener();

        router.patch(route('documents.rename', doc.id), { name }, {
            preserveScroll: true,
            onSuccess: () => {
                const pending = thenStart;
                cancelEdit();
                showToast('Filename updated');
                if (pending) beginEdit(pending);
            },
            onError: (errors) => {
                savingId.value = null;
                const nameError = errors?.name;
                renameError.value = Array.isArray(nameError)
                    ? nameError[0]
                    : (nameError ?? 'Unable to rename document. Try again.');
                attachOutsideListener();
                focusAndSelect();
            },
            onFinish: () => {
                if (savingId.value === doc.id) {
                    savingId.value = null;
                }
            },
        });
    }

    function commitEdit({ thenStart = null } = {}) {
        if (editingId.value === null) {
            if (thenStart) beginEdit(thenStart);
            return;
        }

        const name            = buildCurrentName();
        const validationError = validateFilename(name);

        if (validationError) {
            renameError.value = validationError;
            return;
        }

        if (name === originalName.value) {
            cancelEdit();
            if (thenStart) beginEdit(thenStart);
            return;
        }

        const doc = editingDoc.value;
        if (!doc) {
            cancelEdit();
            if (thenStart) beginEdit(thenStart);
            return;
        }

        saveRename(doc, name, thenStart);
    }

    function startEdit(doc) {
        if (savingId.value) return;

        if (editingId.value !== null && editingId.value !== doc.id) {
            commitEdit({ thenStart: doc });
            return;
        }

        if (editingId.value === doc.id) {
            focusAndSelect();
            return;
        }

        beginEdit(doc);
    }

    function onEditKeydown(event) {
        if (editingId.value === null || savingId.value) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            commitEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEdit();
        } else if (event.key === 'Tab') {
            commitEdit();
        }
    }

    onBeforeUnmount(() => {
        detachOutsideListener();
        clearTimeout(toastTimer);
    });

    return {
        editingId,
        editingBase,
        editingExt,
        savingId,
        renameError,
        toast,
        editRootRef,
        renameComponentRef,
        startEdit,
        cancelEdit,
        commitEdit,
        onEditKeydown,
        duplicateWarning,
    };
}
