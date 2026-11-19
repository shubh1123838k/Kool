import React from 'react';

export interface SkillLogoItem {
  name: string;
  isBrand?: boolean;
  renderIcon: (instancePrefix: string) => React.ReactNode;
}

export const SKILL_LOGOS: SkillLogoItem[] = [
  {
    name: 'Arcitic',
    isBrand: true,
    renderIcon: (p) => (
      <svg
        className="skill-logo-icon skill-logo-brand"
        width="44"
        height="44"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 120 120"
        fill="none"
      >
        <defs>
          <linearGradient id={`${p}-arcitic-grad`} x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#F05A3B" />
            <stop offset="55%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="#0B0C10" />
        <rect x="2" y="2" width="116" height="116" rx="26" stroke="#27272A" strokeWidth="2" />
        <path
          d="M60 22 93 92H76L60 56 44 92H27L60 22Z"
          fill={`url(#${p}-arcitic-grad)`}
        />
        <circle cx="60" cy="79" r="8" fill="#EBE1D0" />
      </svg>
    ),
  },
  {
    name: 'Python',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="#3776AB"
          d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
        />
      </svg>
    ),
  },
  {
    name: 'OpenCV',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="#FF2A2A"
          d="M12 2a4.6 4.6 0 1 0 3.98 6.9l-2.3-1.33A1.95 1.95 0 1 1 12 4.65c.74 0 1.38.4 1.72 1l2.29-1.32A4.59 4.59 0 0 0 12 2Z"
        />
        <path
          fill="#22C55E"
          d="M6.4 12.2a4.6 4.6 0 1 0 4.6 7.96l-1.33-2.3a1.95 1.95 0 1 1-1.95-3.38c.37-.21.79-.29 1.19-.24l.7-2.55a4.6 4.6 0 0 0-3.21.51Z"
        />
        <path
          fill="#3B82F6"
          d="M17.6 12.2a4.6 4.6 0 0 0-3.21-.51l.7 2.55a1.95 1.95 0 1 1-1.95 3.38l-1.33 2.3a4.6 4.6 0 1 0 5.79-7.72Z"
        />
      </svg>
    ),
  },
  {
    name: 'MySQL',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" fill="none" stroke="#00758F" strokeWidth="2" />
        <path
          d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13"
          fill="none"
          stroke="#00758F"
          strokeWidth="2"
        />
        <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" fill="none" stroke="#F29111" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'NumPy',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path fill="#4DABCF" d="M12 1.8 3.2 6.8v10.4L12 22.2l8.8-5V6.8L12 1.8Zm0 2.6 6.2 3.5-6.2 3.5L5.8 7.9 12 4.4Z" />
        <path fill="#4D77CF" d="M4.8 9.2 11 12.7v7l-6.2-3.5v-7Zm14.4 0v7L13 19.7v-7l6.2-3.5Z" />
      </svg>
    ),
  },
  {
    name: 'Pandas',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <rect x="6" y="3" width="3.2" height="6.5" rx="0.8" fill="#150458" />
        <rect x="6" y="14.5" width="3.2" height="6.5" rx="0.8" fill="#150458" />
        <rect x="6" y="10.7" width="3.2" height="2.6" rx="0.8" fill="#FFCA00" />
        <rect x="14.8" y="3" width="3.2" height="6.5" rx="0.8" fill="#150458" />
        <rect x="14.8" y="14.5" width="3.2" height="6.5" rx="0.8" fill="#150458" />
        <rect x="10.4" y="6.8" width="3.2" height="10.4" rx="0.8" fill="#E70488" />
      </svg>
    ),
  },
  {
    name: 'Matplotlib',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#11557C" strokeWidth="1.6" />
        <path d="M12 12 12 3A9 9 0 0 1 19.8 7.5Z" fill="#F97316" />
        <path d="M12 12 19.8 7.5A9 9 0 0 1 19.8 16.5Z" fill="#38BDF8" />
        <path d="M12 12 4.2 16.5A9 9 0 0 1 12 3Z" fill="#22C55E" opacity="0.85" />
        <circle cx="12" cy="12" r="2.2" fill="#0B0C10" />
      </svg>
    ),
  },
  {
    name: 'VS Code',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="#007ACC"
          d="M17.5 2.2 9.4 9.6 4.7 6 2.5 7.2v9.6L4.7 18l4.7-3.6 8.1 7.4L21.5 20V4L17.5 2.2Zm0 4.5v10.6L11.8 12l5.7-5.3Z"
        />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="#26A5E4"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.64 6.8-1.58 7.45c-.12.53-.43.66-.87.41l-2.41-1.78-1.16 1.12c-.13.13-.24.24-.49.24l.17-2.46 4.48-4.05c.2-.17-.04-.27-.3-.1l-5.54 3.49-2.38-.75c-.52-.16-.53-.52.11-.77l9.3-3.58c.43-.16.81.1.67.78Z"
        />
      </svg>
    ),
  },
  {
    name: 'Prompt AI',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          fill="#F05A3B"
          d="M12 2 14.3 8.2 20.5 10.5 14.3 12.8 12 19 9.7 12.8 3.5 10.5 9.7 8.2 12 2Z"
        />
        <circle cx="18.5" cy="18.5" r="2" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    name: 'CS50',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <rect x="2.5" y="4" width="19" height="16" rx="3.5" fill="#A51C30" />
        <text
          x="12"
          y="14.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="7.2"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          CS50
        </text>
      </svg>
    ),
  },
  {
    name: 'Data Science',
    renderIcon: () => (
      <svg className="skill-logo-icon" width="44" height="44" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <rect x="3" y="13" width="3.5" height="7" rx="1" fill="#38BDF8" />
        <rect x="8.5" y="9" width="3.5" height="11" rx="1" fill="#818CF8" />
        <rect x="14" y="5" width="3.5" height="15" rx="1" fill="#34D399" />
        <path d="M3 10.5 9 6.5l5 2 7-5" fill="none" stroke="#F05A3B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];
