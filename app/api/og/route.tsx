import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const score = parseInt(searchParams.get('score') ?? '74')
  const tier = searchParams.get('tier') ?? 'attractive'

  const tierColors: Record<string, string> = {
    elite: '#06B6D4',
    attractive: '#10B981',
    average: '#F59E0B',
    below: '#EF4444',
  }

  const tierLabels: Record<string, string> = {
    elite: 'Elite',
    attractive: 'Attractive',
    average: 'Average',
    below: 'Below Average',
  }

  const color = tierColors[tier] ?? '#10B981'
  const label = tierLabels[tier] ?? tier

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#080C14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            top: '15px',
            left: '300px',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 10 }}>

          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#EEF2FF' }}>UP</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 48%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              FACE
            </span>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '120px', fontWeight: '900', color, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '40px', color: 'rgba(238,242,255,0.4)' }}>/100</span>
            </div>
            <div style={{
              background: `${color}20`,
              border: `1px solid ${color}40`,
              borderRadius: '999px',
              padding: '6px 20px',
              color,
              fontSize: '18px',
              fontWeight: '600',
            }}>
              {label}
            </div>
          </div>

          {/* CTA */}
          <span style={{ color: 'rgba(139,157,195,0.8)', fontSize: '18px' }}>
            Découvrez votre score sur upface.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
