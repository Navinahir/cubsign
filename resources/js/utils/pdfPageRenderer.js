/**
 * Unified pdf.js page renderer with task cancellation and canvas-mount waiting.
 * Used for both main preview and thumbnail canvases.
 */

const DEBUG = import.meta.env.DEV;

function log(...args) {
    if (DEBUG) {
        console.debug('[CubSign PDF]', ...args);
    }
}

export function createPdfRenderer() {
    /** @type {Map<string, import('pdfjs-dist').RenderTask>} */
    const activeTasks = new Map();

    function cancelAll() {
        for (const [key, task] of activeTasks.entries()) {
            try {
                task.cancel();
            } catch {
                // ignore
            }
            activeTasks.delete(key);
        }
    }

    function cancelTask(taskKey) {
        const task = activeTasks.get(taskKey);
        if (!task) return;
        try {
            task.cancel();
        } catch {
            // ignore
        }
        activeTasks.delete(taskKey);
    }

    /**
     * Wait until a canvas ref is mounted and connected to the document.
     */
    async function waitForCanvas(getCanvas, index, { label = 'main', maxAttempts = 40 } = {}) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            const canvas = getCanvas(index);
            if (canvas?.isConnected) {
                log('Canvas mounted', {
                    label,
                    index,
                    attempt,
                    offsetWidth:  canvas.offsetWidth,
                    offsetHeight: canvas.offsetHeight,
                    clientWidth:  canvas.clientWidth,
                    clientHeight: canvas.clientHeight,
                });
                return canvas;
            }
        }
        log('Canvas NOT mounted', { label, index, maxAttempts });
        return null;
    }

    async function computePageDimensions(pdfDoc, numPages, scale) {
        const dims = [];
        for (let i = 1; i <= numPages; i++) {
            const page     = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            dims.push({ w: viewport.width, h: viewport.height });
        }
        log('Page dimensions computed', { numPages, scale, dims });
        return dims;
    }

    /**
     * Render a PDF page into a canvas. Cancels any in-flight render for the same taskKey.
     */
    async function renderToCanvas(pdfDoc, pageNum, canvas, scale, taskKey) {
        if (!pdfDoc) {
            throw new Error(`renderToCanvas: pdfDoc is null (page ${pageNum})`);
        }
        if (!canvas) {
            throw new Error(`renderToCanvas: canvas is null (page ${pageNum})`);
        }

        cancelTask(taskKey);

        const page     = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const ctx      = canvas.getContext('2d');

        if (!ctx) {
            throw new Error(`renderToCanvas: no 2d context (page ${pageNum})`);
        }

        const w = Math.floor(viewport.width);
        const h = Math.floor(viewport.height);

        if (w <= 0 || h <= 0) {
            throw new Error(`renderToCanvas: invalid viewport ${w}x${h} (page ${pageNum})`);
        }

        canvas.width  = w;
        canvas.height = h;

        log('Render started', { pageNum, scale, taskKey, w, h });

        const renderTask = page.render({ canvasContext: ctx, viewport });
        activeTasks.set(taskKey, renderTask);

        try {
            await renderTask.promise;
            log('Render finished', { pageNum, taskKey });
        } catch (err) {
            if (err?.name === 'RenderingCancelledException') {
                log('Render cancelled', { pageNum, taskKey });
                return null;
            }
            console.error('[CubSign PDF] Render error', { pageNum, taskKey, err });
            throw err;
        } finally {
            if (activeTasks.get(taskKey) === renderTask) {
                activeTasks.delete(taskKey);
            }
        }

        return { width: viewport.width, height: viewport.height };
    }

    return {
        cancelAll,
        cancelTask,
        waitForCanvas,
        computePageDimensions,
        renderToCanvas,
    };
}
