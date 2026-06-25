import { ref, shallowRef, markRaw } from 'vue';
import SignaturePad from 'signature_pad';

export const SIGNATURE_PAD_OPTIONS = {
    minWidth:             0.6,
    maxWidth:             2.2,
    velocityFilterWeight: 0.7,
    throttle:             8,
    minDistance:          2,
    penColor:             '#1e40af',
    backgroundColor:      'rgba(0,0,0,0)',
};

const CANVAS_HEIGHT_PX = 100;

/**
 * High-DPI signature_pad wrapper. Pad instance is non-reactive (shallowRef).
 */
export function useSignaturePad() {
    const canvasRef    = ref(null);
    const containerRef = ref(null);
    const pad          = shallowRef(null);
    const hasDrawing   = ref(false);

    let resizeObserver = null;

    function getRatio() {
        return Math.max(window.devicePixelRatio || 1, 2);
    }

    function resizeCanvas(preserve = true) {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const width = canvas.offsetWidth;
        if (width <= 0) return;

        const ratio = getRatio();
        const data  = preserve && pad.value && !pad.value.isEmpty() ? pad.value.toData() : [];

        canvas.width  = Math.floor(width * ratio);
        canvas.height = Math.floor(CANVAS_HEIGHT_PX * ratio);
        canvas.style.width  = `${width}px`;
        canvas.style.height = `${CANVAS_HEIGHT_PX}px`;

        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        if (pad.value) {
            pad.value.clear();
            if (data.length > 0) {
                pad.value.fromData(data);
            }
            hasDrawing.value = !pad.value.isEmpty();
        }
    }

    let touchMoveHandler = null;
    let isStrokeActive   = false;

    function bindTouchScrollLock(canvas) {
        touchMoveHandler = (e) => {
            if (isStrokeActive) e.preventDefault();
        };
        canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    }

    function unbindTouchScrollLock(canvas) {
        if (touchMoveHandler && canvas) {
            canvas.removeEventListener('touchmove', touchMoveHandler);
        }
        touchMoveHandler = null;
        isStrokeActive   = false;
    }

    function initPad() {
        if (pad.value || !canvasRef.value) return;

        resizeCanvas(false);

        const instance = markRaw(new SignaturePad(canvasRef.value, { ...SIGNATURE_PAD_OPTIONS }));
        pad.value = instance;

        bindTouchScrollLock(canvasRef.value);

        const syncEmpty = () => {
            hasDrawing.value = !instance.isEmpty();
        };

        instance.addEventListener('endStroke', () => {
            isStrokeActive = false;
            syncEmpty();
        });
        instance.addEventListener('beginStroke', () => {
            isStrokeActive = true;
            hasDrawing.value = true;
        });
    }

    function setupResizeObserver() {
        if (!containerRef.value || resizeObserver) return;

        resizeObserver = new ResizeObserver(() => {
            if (pad.value) {
                resizeCanvas(true);
            }
        });
        resizeObserver.observe(containerRef.value);
    }

    function setReadOnly(readonly) {
        if (!pad.value) return;
        if (readonly) {
            pad.value.off();
        } else {
            pad.value.on();
        }
    }

    function clearPad() {
        pad.value?.clear();
        hasDrawing.value = false;
    }

    function undoStroke() {
        if (!pad.value) return;
        const data = pad.value.toData();
        if (data.length === 0) return;
        data.pop();
        pad.value.fromData(data);
        hasDrawing.value = !pad.value.isEmpty();
    }

    function exportPng() {
        if (!pad.value || pad.value.isEmpty()) return null;
        return pad.value.toDataURL('image/png', 1.0);
    }

    function isEmpty() {
        return !pad.value || pad.value.isEmpty();
    }

    function destroy() {
        resizeObserver?.disconnect();
        resizeObserver = null;
        unbindTouchScrollLock(canvasRef.value);
        pad.value?.off();
        pad.value = null;
        hasDrawing.value = false;
    }

    return {
        canvasRef,
        containerRef,
        pad,
        hasDrawing,
        initPad,
        resizeCanvas,
        setupResizeObserver,
        setReadOnly,
        clearPad,
        undoStroke,
        exportPng,
        isEmpty,
        destroy,
        CANVAS_HEIGHT_PX,
    };
}
