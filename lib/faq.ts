export const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export type FaqKey = (typeof FAQ_KEYS)[number]
