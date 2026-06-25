export const FIELD_TYPES = [
    {
        id: 'signature',
        label: 'Signature',
        description: 'Full handwritten or typed signature',
        icon: 'signature',
    },
    {
        id: 'initials',
        label: 'Initials',
        description: 'Short initials for each page',
        icon: 'initials',
    },
    {
        id: 'name',
        label: 'Name',
        description: 'Printed full name',
        icon: 'name',
    },
    {
        id: 'text',
        label: 'Text',
        description: 'Free-form text input',
        icon: 'text',
    },
    {
        id: 'date',
        label: 'Date',
        description: 'Signing date field',
        icon: 'date',
    },
    {
        id: 'checkbox',
        label: 'Checkbox',
        description: 'Agree / confirm checkbox',
        icon: 'checkbox',
    },
];

export const FIELD_DEFAULTS = {
    signature: { w: 180, h: 60 },
    initials:  { w: 90,  h: 40 },
    date:      { w: 140, h: 32 },
    name:      { w: 160, h: 32 },
    text:      { w: 160, h: 32 },
    checkbox:  { w: 28,  h: 28 },
};

export const RECIPIENT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const TYPE_FONTS = [
    { id: 'script',  label: 'Script',  cls: "font-['Georgia'] italic text-2xl tracking-wide" },
    { id: 'cursive', label: 'Cursive', cls: 'font-sans italic text-2xl tracking-wide text-gray-700' },
    { id: 'print',   label: 'Print',   cls: 'font-sans font-bold text-xl tracking-wider text-gray-900' },
];
