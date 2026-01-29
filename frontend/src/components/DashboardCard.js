import React from 'react'

export default function DashboardCard({title,description,onClick}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-800 
                 border border-zinc-700 rounded-xl p-6 hover:scale-105 
                 transition text-white"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-zinc-400 mt-2">{description}</p>
    </div>
  )
}
