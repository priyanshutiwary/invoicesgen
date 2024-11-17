"use client"

import { cn } from "@/lib/utils"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { MouseEvent } from "react"

interface Card3dProps {
  children: React.ReactNode
  className?: string
}

export const Card3d: React.FC<Card3dProps> = ({ children, className }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5
    
    mouseX.set(x)
    mouseY.set(y)
  }

  const style = {
    transform: useMotionTemplate`perspective(1000px) rotateX(${useMotionValue(mouseY).get() * 5}deg) rotateY(${useMotionValue(mouseX).get() * -5}deg)`,
    transition: "all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)"
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={style}
      className={cn(
        "relative h-full rounded-xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {children}
    </motion.div>
  )
}