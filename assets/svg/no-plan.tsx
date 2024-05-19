const NoPlan = () => (
  <svg
    className="w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* <!-- Ledger Symbol --> */}
    <rect x="12" y="8" width="40" height="48" rx="4" ry="4" />
    <line x1="16" y1="16" x2="48" y2="16" />
    <line x1="16" y1="24" x2="48" y2="24" />
    <line x1="16" y1="32" x2="48" y2="32" />
    <line x1="16" y1="40" x2="48" y2="40" />
    <line x1="16" y1="48" x2="48" y2="48" />
    {/* <!-- Strikethrough Symbol --> */}
    <line
      x1="14"
      y1="14"
      x2="50"
      y2="50"
      stroke="currentColor"
      strokeWidth="4"
    />
  </svg>
)

export default NoPlan
