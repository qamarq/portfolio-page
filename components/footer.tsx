import React from 'react'

export default function Footer() {
  return (
    <div className="w-full flex flex-col items-center justify-center border-t py-10 border-border/40">
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Kamil Marczak. All rights reserved.
      </p>
      <p className="font-cal">Made with ❤️ by Kamil Marczak</p>
    </div>
  )
}
