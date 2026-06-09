'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

interface BeamConfig {
  id: string
  // true = horizontal, false = vertical
  horizontal: boolean
  // position along the cross axis (0-100%)
  crossPos: string
  // length of the beam element
  size: string
  duration: number
  delay: number
  reverse?: boolean
}

const beams: BeamConfig[] = [
  { id: "h1", horizontal: true,  crossPos: "15%",  size: "200px", duration: 3.0, delay: 0 },
  { id: "h2", horizontal: true,  crossPos: "38%",  size: "160px", duration: 2.6, delay: 0.9,  reverse: true },
  { id: "h3", horizontal: true,  crossPos: "62%",  size: "220px", duration: 3.4, delay: 1.7 },
  { id: "h4", horizontal: true,  crossPos: "80%",  size: "140px", duration: 2.2, delay: 2.4,  reverse: true },
  { id: "h5", horizontal: true,  crossPos: "92%",  size: "180px", duration: 2.8, delay: 0.5 },
  { id: "v1", horizontal: false, crossPos: "12%",  size: "180px", duration: 2.8, delay: 0.3 },
  { id: "v2", horizontal: false, crossPos: "30%",  size: "160px", duration: 3.2, delay: 1.1,  reverse: true },
  { id: "v3", horizontal: false, crossPos: "55%",  size: "200px", duration: 2.5, delay: 0.7 },
  { id: "v4", horizontal: false, crossPos: "75%",  size: "150px", duration: 3.6, delay: 1.8,  reverse: true },
  { id: "v5", horizontal: false, crossPos: "90%",  size: "170px", duration: 2.9, delay: 2.1 },
]

const Beam = ({ beam }: { beam: BeamConfig }) => {
  const { horizontal, crossPos, size, duration, delay, reverse } = beam

  const style: React.CSSProperties = horizontal
    ? {
        top: crossPos,
        left: 0,
        width: size,
        height: "1.5px",
        background: "linear-gradient(90deg, transparent, hsl(42 80% 66%), hsl(38 55% 55%), transparent)",
      }
    : {
        left: crossPos,
        top: 0,
        height: size,
        width: "1.5px",
        background: "linear-gradient(180deg, transparent, hsl(42 80% 66%), hsl(38 55% 55%), transparent)",
      }

  const fromVal = reverse ? "110%" : "-30%"
  const toVal   = reverse ? "-30%" : "110%"
  const animKey = horizontal ? "x" : "y"

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        ...style,
        boxShadow: horizontal
          ? "0 0 8px 1px hsl(42 80% 66% / 0.5)"
          : "0 0 8px 1px hsl(42 80% 66% / 0.5)",
      }}
      initial={{ [animKey]: fromVal, opacity: 0 }}
      animate={{ [animKey]: toVal,   opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "linear",
        opacity: { times: [0, 0.1, 0.9, 1] },
      }}
    />
  )
}

export const GridBeam: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('relative w-full h-full overflow-hidden', className)}>
    {beams.map((b) => <Beam key={b.id} beam={b} />)}
    {children}
  </div>
)
