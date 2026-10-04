import React from 'react';

interface UdaanMarkProps {
  className?: string;
  title?: string;
}

/** Shared Udaan CAT brand mark: a rising flight path toward a sunrise. */
export const UdaanMark: React.FC<UdaanMarkProps> = ({
  className = '',
  title = 'Udaan CAT',
}) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="udaan-mark-gradient" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4338CA" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#udaan-mark-gradient)" />
    <circle cx="35" cy="13" r="4.5" fill="#FBBF24" />
    <path
      d="M8.5 30.5C13.2 23.2 18.5 19.5 24.4 19.5c4.3 0 7.6 1.9 10.9 5.1-1.9 2.1-4.5 3.2-7.7 3.2-3.4 0-6.4-1.3-9.1-3.8-2.5 3.9-5.7 6.1-9.7 6.6l-.3-.1Z"
      fill="white"
      fillOpacity="0.96"
    />
    <path
      d="M24 37V12m0 0-6.5 6.5M24 12l6.5 6.5"
      stroke="#FEF3C7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
