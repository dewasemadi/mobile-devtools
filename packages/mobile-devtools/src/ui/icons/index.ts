const createSvgIcon = (content: string, width = 16, height = 16) =>
  `
  <svg
    width="${width}"
    height="${height}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="width:${width}px;height:${height}px;flex-shrink:0;display:block;aspect-ratio:1/1;"
  >
    ${content.trim()}
  </svg>
`.trim();

export const TRASH_ICON = createSvgIcon(`
  <path d="M3 6h18" />
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
`);

export const CLOSE_ICON = createSvgIcon(`
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
`);

export const BACK_ICON = createSvgIcon(`
  <line x1="19" y1="12" x2="5" y2="12" />
  <polyline points="12 19 5 12 12 5" />
`);

export const SUN_ICON = createSvgIcon(`
  <circle cx="12" cy="12" r="5" />
  <line x1="12" y1="1" x2="12" y2="3" />
  <line x1="12" y1="21" x2="12" y2="23" />
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
  <line x1="1" y1="12" x2="3" y2="12" />
  <line x1="21" y1="12" x2="23" y2="12" />
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
`);

export const MOON_ICON = createSvgIcon(`
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
`);

export const LOGO_ICON = createSvgIcon(
  `
  <rect x="3" y="3" width="18" height="18" rx="4" />
  <path d="m8 10 3 3-3 3" />
  <path d="M14 16h3" />
`,
  18,
  18
);

export const PLUS_ICON = createSvgIcon(`
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
`);

export const CHECK_ICON = createSvgIcon(`
  <polyline points="20 6 9 17 4 12" />
`);

export const COPY_ICON = createSvgIcon(`
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
`);

export const SHARE_ICON = createSvgIcon(`
  <circle cx="18" cy="5" r="3" />
  <circle cx="6" cy="12" r="3" />
  <circle cx="18" cy="19" r="3" />
  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
`);

export const INSPECT_ICON = createSvgIcon(`
  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2" />
`);

export const REFRESH_ICON = createSvgIcon(`
  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
`);

export const CHEVRON_RIGHT_ICON = createSvgIcon(`
  <polyline points="9 18 15 12 9 6" />
`);

export const CHEVRON_DOWN_ICON = createSvgIcon(`
  <polyline points="6 9 12 15 18 9" />
`);

export const ARROW_UP_ICON = createSvgIcon(
  `
  <line x1="12" y1="19" x2="12" y2="5" />
  <polyline points="5 12 12 5 19 12" />
`,
  12,
  12
);

export const ARROW_DOWN_ICON = createSvgIcon(
  `
  <line x1="12" y1="5" x2="12" y2="19" />
  <polyline points="19 12 12 19 5 12" />
`,
  12,
  12
);
