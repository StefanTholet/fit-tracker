import React from 'react'

const FilePenIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      data-id="5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 text-blue-500 ${className}`}
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path>
    </svg>
  )
}

export default FilePenIcon
