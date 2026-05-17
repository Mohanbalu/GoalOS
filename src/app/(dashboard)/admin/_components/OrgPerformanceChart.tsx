"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"

const data = [
  { name: "Executive", score: 94, status: "Healthy" },
  { name: "Engineering", score: 91, status: "Optimized" },
  { name: "Operations", score: 88, status: "Healthy" },
  { name: "Sales & Marketing", score: 79, status: "Active" },
  { name: "Customer Success", score: 84, status: "Stable" },
  { name: "Human Resources", score: 76, status: "Stable" },
  { name: "Product Strategy", score: 82, status: "Optimized" },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-white dark:bg-slate-900 border border-border shadow-xl rounded-xl p-4 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
            <div className={`h-2 w-2 rounded-full ${item.score > 85 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`} />
          </div>
          <div className="h-[1px] bg-border/40 w-full" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Completion Rate</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{item.score}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Governance Status</span>
              <span className={`text-[10px] font-black uppercase tracking-wider ${item.score > 85 ? 'text-emerald-600' : 'text-blue-600'}`}>{item.status}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function OrgPerformanceChart() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <div className="h-[350px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 20, left: -20, bottom: 20 }}
          onMouseMove={(state) => {
            if (state.activeTooltipIndex !== undefined) {
              setHoveredIndex(typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null)
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={9} 
            fontWeight={800}
            tickLine={false} 
            axisLine={false} 
            dy={15}
            interval={0}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            fontWeight={800}
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'transparent' }} 
          />
          <Bar 
            dataKey="score" 
            radius={[8, 8, 0, 0]} 
            barSize={36}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={hoveredIndex === index ? "#3b82f6" : "#2563eb"} 
                fillOpacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                className="transition-all duration-500 ease-out"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
