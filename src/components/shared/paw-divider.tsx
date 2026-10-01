'use client'

import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'

export function PawDivider({ variant = 'center' }: { variant?: 'center' | 'left' | 'scattered' }) {
  if (variant === 'center') {
    return (
      <div className="relative flex items-center justify-center py-6" aria-hidden>
        <div className="absolute left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent sm:w-64" />
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm"
        >
          <PawPrint className="h-5 w-5" />
        </motion.div>
        <div className="absolute left-1/2 mt-16 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent sm:w-64" />
      </div>
    )
  }

  if (variant === 'left') {
    return (
      <div className="flex items-center gap-2 py-4" aria-hidden>
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary"
        >
          <PawPrint className="h-4 w-4" />
        </motion.div>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>
    )
  }

  // scattered — a trail of small paws
  return (
    <div className="relative flex items-center justify-center gap-3 py-6" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, i % 2 === 0 ? -8 : 8, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          className="text-primary/40"
        >
          <PawPrint className="h-4 w-4" style={{ transform: `rotate(${i % 2 === 0 ? -15 : 15}deg)` }} />
        </motion.div>
      ))}
    </div>
  )
}
