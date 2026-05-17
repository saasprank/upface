import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UPFACE — Analyse faciale IA',
  description: 'Découvrez votre score d\'attractivité. Notre IA analyse 47 points de votre visage en 8 secondes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
