export function GoatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M10 12C10 12 8 8 6 10C4 12 6 14 8 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 12C30 12 32 8 34 10C36 12 34 14 32 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="22" rx="10" ry="12" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="20" cy="24" rx="8" ry="9" fill="currentColor" fillOpacity="0.3" />
      <circle cx="15" cy="19" r="2" fill="currentColor" />
      <circle cx="25" cy="19" r="2" fill="currentColor" />
      <ellipse cx="20" cy="26" rx="3" ry="2" fill="currentColor" fillOpacity="0.5" />
      <path
        d="M17 30C17 30 18 33 20 33C22 33 23 30 23 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 23C12 23 10 24 10 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M28 23C28 23 30 24 30 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
