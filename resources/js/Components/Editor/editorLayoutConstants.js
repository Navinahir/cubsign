/** Shared resize handles and alignment tools for editor canvases. */

export const RESIZE_HANDLES = [
    { id: 'nw', pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2', cur: 'nwse-resize' },
    { id: 'n', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', cur: 'ns-resize' },
    { id: 'ne', pos: 'top-0 right-0 translate-x-1/2 -translate-y-1/2', cur: 'nesw-resize' },
    { id: 'e', pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2', cur: 'ew-resize' },
    { id: 'se', pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2', cur: 'nwse-resize' },
    { id: 's', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2', cur: 'ns-resize' },
    { id: 'sw', pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2', cur: 'nesw-resize' },
    { id: 'w', pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2', cur: 'ew-resize' },
];

export const ALIGN_TOOLS = [
    { dir: 'left', label: 'Left', title: 'Align to left edge', icon: 'M4 4v16M8 12h12' },
    { dir: 'cx', label: 'Center', title: 'Center horizontally', icon: 'M12 4v16M7 12h4m2 0h4' },
    { dir: 'right', label: 'Right', title: 'Align to right edge', icon: 'M20 4v16M4 12h12' },
    { dir: 'top', label: 'Top', title: 'Align to top edge', icon: 'M4 4h16M12 8v12' },
    { dir: 'cy', label: 'Middle', title: 'Center vertically', icon: 'M4 12h16M12 7v4m0 2v4' },
    { dir: 'bottom', label: 'Bottom', title: 'Align to bottom edge', icon: 'M4 20h16M12 4v12' },
];
