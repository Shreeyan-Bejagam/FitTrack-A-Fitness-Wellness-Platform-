import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @param {...import('clsx').ClassValue} inputs
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Reusable glassmorphism class tokens */
export const glass = {
  base: 'glass',
  card: 'glass-card',
  panel: 'glass-panel',
  nav: 'glass-nav',
  sidebar: 'glass-sidebar',
  input: 'glass-input',
  chip: 'glass-chip',
  cta: 'glass-cta',
  active: 'glass-active',
}
