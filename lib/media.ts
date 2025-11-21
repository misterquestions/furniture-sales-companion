const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="#73e0c7" />
      <stop offset="100%" stop-color="#2f8f7b" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="24" ry="24" fill="url(#g)" />
  <circle cx="200" cy="140" r="48" fill="rgba(255,255,255,0.2)" />
  <path d="M140 210l40-40 30 30 50-60 60 70" stroke="rgba(255,255,255,0.4)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <circle cx="175" cy="125" r="14" fill="rgba(255,255,255,0.4)" />
</svg>`;

export const CATALOG_IMAGE_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(placeholderSvg)}`;
