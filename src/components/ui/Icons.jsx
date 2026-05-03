// Tiny inline SVG icon set so we don't need an extra dependency.
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const ShoppingBag = (p) => (
  <svg {...base} {...p}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 1 1 6 0" />
  </svg>
);

export const User = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);

export const Search = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const TextIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 6h14" />
    <path d="M12 6v14" />
  </svg>
);

export const ImageIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 17-5-5-9 9" />
  </svg>
);

export const ShapesIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="7" cy="17" r="3" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
    <path d="M9 4l4 7H5l4-7z" />
  </svg>
);

export const TemplateIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const Trash = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
  </svg>
);

export const Save = (p) => (
  <svg {...base} {...p}>
    <path d="M5 5h11l3 3v11H5z" />
    <path d="M8 5v5h7V5" />
    <path d="M8 14h8v5H8z" />
  </svg>
);

export const Download = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);
