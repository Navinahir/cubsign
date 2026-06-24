/**
 * Production signature capture using signature_pad (bezier smoothing, high-DPI).
 */
import SignaturePad from 'signature_pad';

const PEN_COLOR = '#1e293b';
const MIN_DPR   = 3;

const TYPE_FONTS = [
    { id: 'script',  label: 'Script',  family: 'Georgia, serif',        style: 'italic', weight: '400', size: 0.55 },
    { id: 'cursive', label: 'Cursive', family: '"Segoe Script", cursive', style: 'italic', weight: '400', size: 0.50 },
    { id: 'print',   label: 'Print',   family: 'Arial, sans-serif',      style: 'normal', weight: '600', size: 0.48 },
];

export function createSignaturePad(canvas, { isInitials = false, onChange = null } = {}) {
    const displayHeight = isInitials ? 100 : 150;
    let pad               = null;
    let ratio             = MIN_DPR;
    let activeTab         = 'draw';
    let typedText         = '';
    let typedFontId       = 'script';
    let resizeObserver    = null;
    let hasDrawnContent   = false;

    canvas.style.width  = '100%';
    canvas.style.height = `${displayHeight}px`;
    canvas.style.touchAction = 'none';

    function currentRatio() {
        return Math.max(window.devicePixelRatio || 1, MIN_DPR);
    }

    function resizeCanvas() {
        ratio = currentRatio();
        const rect   = canvas.getBoundingClientRect();
        const width  = Math.max(rect.width, isInitials ? 260 : 320);
        const height = displayHeight;

        canvas.width  = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);

        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        if (pad) {
            const data = pad.toData();
            pad.clear();
            pad.fromData(data);
        }
    }

    function initDrawPad() {
        resizeCanvas();
        pad = new SignaturePad(canvas, {
            minWidth:   0.8,
            maxWidth:   2.8,
            throttle:   12,
            minDistance: 2,
            penColor:   PEN_COLOR,
            backgroundColor: 'rgba(0,0,0,0)',
        });

        pad.addEventListener('beginStroke', () => {
            hasDrawnContent = true;
            onChange?.();
        });
        pad.addEventListener('endStroke', () => {
            hasDrawnContent = !pad.isEmpty();
            onChange?.();
        });
    }

    function setTab(tab) {
        activeTab = tab;
        if (tab === 'draw' && !pad) {
            initDrawPad();
        }
        onChange?.();
    }

    function clear() {
        if (activeTab === 'draw' && pad) {
            pad.clear();
            hasDrawnContent = false;
        } else {
            typedText = '';
        }
        onChange?.();
    }

    function undo() {
        if (activeTab !== 'draw' || !pad) return;
        const data = pad.toData();
        if (data.length === 0) return;
        data.pop();
        pad.fromData(data);
        hasDrawnContent = data.length > 0;
        onChange?.();
    }

    function setTypedText(text) {
        typedText = text;
        onChange?.();
    }

    function setTypedFont(fontId) {
        typedFontId = fontId;
        onChange?.();
    }

    function renderTypedToCanvas(targetCanvas) {
        const font   = TYPE_FONTS.find(f => f.id === typedFontId) ?? TYPE_FONTS[0];
        const dpr    = currentRatio();
        const w      = Math.max(targetCanvas.parentElement?.clientWidth ?? 320, isInitials ? 260 : 320);
        const h      = displayHeight;

        targetCanvas.width  = Math.floor(w * dpr);
        targetCanvas.height = Math.floor(h * dpr);
        targetCanvas.style.width  = '100%';
        targetCanvas.style.height = `${h}px`;

        const ctx = targetCanvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = PEN_COLOR;
        ctx.textBaseline = 'middle';

        const fontSize = Math.round(h * font.size);
        ctx.font = `${font.style} ${font.weight} ${fontSize}px ${font.family}`;
        ctx.fillText(typedText.trim(), 12, h / 2);
    }

    function exportPng() {
        if (activeTab === 'type') {
            const text = typedText.trim();
            if (text.length < (isInitials ? 1 : 2)) return '';
            const off = document.createElement('canvas');
            renderTypedToCanvas(off);
            return off.toDataURL('image/png', 1.0);
        }

        if (!pad || pad.isEmpty()) return '';
        return canvas.toDataURL('image/png', 1.0);
    }

    function isEmpty() {
        if (activeTab === 'type') {
            const min = isInitials ? 1 : 2;
            return typedText.trim().length < min;
        }
        return !pad || pad.isEmpty();
    }

    function getState() {
        return { activeTab, typedText, typedFontId, typeFonts: TYPE_FONTS };
    }

    function mount(containerEl) {
        initDrawPad();
        if (typeof ResizeObserver !== 'undefined' && containerEl) {
            resizeObserver = new ResizeObserver(() => resizeCanvas());
            resizeObserver.observe(containerEl);
        }
    }

    function destroy() {
        resizeObserver?.disconnect();
        pad = null;
    }

    return {
        mount,
        destroy,
        setTab,
        clear,
        undo,
        setTypedText,
        setTypedFont,
        exportPng,
        isEmpty,
        getState,
        get activeTab() { return activeTab; },
        get typedText() { return typedText; },
        get typedFontId() { return typedFontId; },
        get typeFonts() { return TYPE_FONTS; },
        get isDrawTab() { return activeTab === 'draw'; },
        get hasContent() { return !isEmpty(); },
    };
}
