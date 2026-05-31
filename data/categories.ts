export const CATEGORIES = [
  'Basics',
  'Medical & Clinics',
  'Customer Service',
  'Banking',
  'Emergency & 911',
  'Insurance',
] as const

export type Category = (typeof CATEGORIES)[number]
