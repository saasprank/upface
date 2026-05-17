'use client'

import { useEffect, useState } from 'react'

interface Point { x: number; y: number }

// All positions as [x%, y%] of the oval (W x H)
const LANDMARK_GROUPS: { id: string; points: Point[]; delay: number; pulse?: boolean[] }[] = [
  {
    id: 'contour',
    delay: 0,
    points: [
      { x: 50, y: 8 },{ x: 37, y: 10 },{ x: 26, y: 16 },{ x: 18, y: 26 },
      { x: 14, y: 38 },{ x: 13, y: 50 },{ x: 15, y: 62 },{ x: 20, y: 73 },
      { x: 28, y: 82 },{ x: 38, y: 89 },{ x: 50, y: 92 },
      { x: 62, y: 89 },{ x: 72, y: 82 },{ x: 80, y: 73 },
      { x: 85, y: 62 },{ x: 87, y: 50 },{ x: 86, y: 38 },
    ],
  },
  {
    id: 'left_eye',
    delay: 500,
    pulse: [false, false, true, false, false, false],
    points: [
      { x: 33, y: 37 },{ x: 37, y: 34 },{ x: 41, y: 34 },
      { x: 45, y: 37 },{ x: 41, y: 40 },{ x: 37, y: 40 },
    ],
  },
  {
    id: 'right_eye',
    delay: 500,
    pulse: [false, false, true, false, false, false],
    points: [
      { x: 55, y: 37 },{ x: 59, y: 34 },{ x: 63, y: 34 },
      { x: 67, y: 37 },{ x: 63, y: 40 },{ x: 59, y: 40 },
    ],
  },
  {
    id: 'left_brow',
    delay: 1000,
    points: [
      { x: 29, y: 29 },{ x: 33, y: 27 },{ x: 38, y: 26 },
      { x: 42, y: 27 },{ x: 45, y: 29 },
    ],
  },
  {
    id: 'right_brow',
    delay: 1000,
    points: [
      { x: 55, y: 29 },{ x: 58, y: 27 },{ x: 62, y: 26 },
      { x: 67, y: 27 },{ x: 71, y: 29 },
    ],
  },
  {
    id: 'nose',
    delay: 1500,
    points: [
      { x: 50, y: 42 },{ x: 48, y: 51 },{ x: 50, y: 58 },{ x: 52, y: 51 },
    ],
  },
  {
    id: 'mouth',
    delay: 2000,
    points: [
      { x: 39, y: 71 },{ x: 44, y: 68 },{ x: 50, y: 67 },
      { x: 56, y: 68 },{ x: 61, y: 71 },
      { x: 56, y: 75 },{ x: 50, y: 77 },{ x: 44, y: 75 },
    ],
  },
  {
    id: 'jawline',
    delay: 2500,
    points: [
      { x: 22, y: 55 },{ x: 20, y: 64 },{ x: 21, y: 73 },
      { x: 26, y: 81 },{ x: 50, y: 91 },
      { x: 74, y: 81 },{ x: 79, y: 73 },{ x: 80, y: 64 },{ x: 78, y: 55 },
    ],
  },
  {
    id: 'cheeks',
    delay: 3000,
    pulse: [true, true],
    points: [
      { x: 19, y: 48 },{ x: 81, y: 48 },
    ],
  },
]

const CONNECTIONS: [string, number, string, number][] = [
  ['contour', 0, 'contour', 1], ['contour', 1, 'contour', 2], ['contour', 2, 'contour', 3],
  ['contour', 3, 'contour', 4], ['contour', 4, 'contour', 5], ['contour', 5, 'contour', 6],
  ['contour', 6, 'contour', 7], ['contour', 7, 'contour', 8], ['contour', 8, 'contour', 9],
  ['contour', 9, 'contour', 10], ['contour', 10, 'contour', 11], ['contour', 11, 'contour', 12],
  ['contour', 12, 'contour', 13], ['contour', 13, 'contour', 14], ['contour', 14, 'contour', 15],
  ['contour', 15, 'contour', 16],
  ['left_eye', 0, 'left_eye', 1], ['left_eye', 1, 'left_eye', 2], ['left_eye', 2, 'left_eye', 3],
  ['left_eye', 3, 'left_eye', 4], ['left_eye', 4, 'left_eye', 5], ['left_eye', 5, 'left_eye', 0],
  ['right_eye', 0, 'right_eye', 1], ['right_eye', 1, 'right_eye', 2], ['right_eye', 2, 'right_eye', 3],
  ['right_eye', 3, 'right_eye', 4], ['right_eye', 4, 'right_eye', 5], ['right_eye', 5, 'right_eye', 0],
  ['left_brow', 0, 'left_brow', 1], ['left_brow', 1, 'left_brow', 2], ['left_brow', 2, 'left_brow', 3], ['left_brow', 3, 'left_brow', 4],
  ['right_brow', 0, 'right_brow', 1], ['right_brow', 1, 'right_brow', 2], ['right_brow', 2, 'right_brow', 3], ['right_brow', 3, 'right_brow', 4],
  ['nose', 0, 'nose', 1], ['nose', 1, 'nose', 2], ['nose', 1, 'nose', 3],
  ['mouth', 0, 'mouth', 1], ['mouth', 1, 'mouth', 2], ['mouth', 2, 'mouth', 3], ['mouth', 3, 'mouth', 4],
  ['mouth', 4, 'mouth', 5], ['mouth', 5, 'mouth', 6], ['mouth', 6, 'mouth', 7], ['mouth', 7, 'mouth', 0],
  ['jawline', 0, 'jawline', 1], ['jawline', 1, 'jawline', 2], ['jawline', 2, 'jawline', 3],
  ['jawline', 3, 'jawline', 4], ['jawline', 4, 'jawline', 5], ['jawline', 5, 'jawline', 6],
  ['jawline', 6, 'jawline', 7], ['jawline', 7, 'jawline', 8],
]

interface FaceLandmarksProps {
  W: number
  H: number
  visible: boolean
}

export default function FaceLandmarks({ W, H, visible }: FaceLandmarksProps) {
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set())
  const [showLines, setShowLines] = useState(false)

  useEffect(() => {
    if (!visible) {
      setVisibleGroups(new Set())
      setShowLines(false)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    LANDMARK_GROUPS.forEach(group => {
      const t = setTimeout(() => {
        setVisibleGroups(prev => new Set([...prev, group.id]))
      }, group.delay)
      timers.push(t)
    })

    const linesTimer = setTimeout(() => setShowLines(true), 3500)
    timers.push(linesTimer)

    return () => timers.forEach(clearTimeout)
  }, [visible])

  if (!visible) return null

  // Build point map for connections
  const pointMap: Record<string, Point[]> = {}
  LANDMARK_GROUPS.forEach(g => { pointMap[g.id] = g.points })

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
    >
      {/* Connection lines */}
      {showLines && CONNECTIONS.map(([g1, i1, g2, i2], idx) => {
        if (!pointMap[g1] || !pointMap[g2]) return null
        const p1 = pointMap[g1][i1]
        const p2 = pointMap[g2][i2]
        if (!p1 || !p2) return null
        return (
          <line
            key={idx}
            x1={W * p1.x / 100} y1={H * p1.y / 100}
            x2={W * p2.x / 100} y2={H * p2.y / 100}
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="0.8"
            style={{ animation: 'fadeInLine 0.5s ease forwards' }}
          />
        )
      })}

      {/* Points */}
      {LANDMARK_GROUPS.map(group =>
        visibleGroups.has(group.id) && group.points.map((pt, i) => {
          const cx = W * pt.x / 100
          const cy = H * pt.y / 100
          const isPulsing = group.pulse?.[i]
          return (
            <circle
              key={`${group.id}-${i}`}
              cx={cx} cy={cy} r="2.5"
              fill="#06B6D4"
              style={{
                animation: isPulsing
                  ? 'landmarkPulse 1.2s ease-in-out infinite'
                  : `landmarkAppear 0.3s ease ${i * 50}ms forwards`,
                opacity: isPulsing ? 1 : 0,
              }}
            />
          )
        })
      )}

      {/* Scan line overlay */}
      <line
        x1="0" y1="0" x2={W} y2="0"
        stroke="rgba(6,182,212,0.4)"
        strokeWidth="1.5"
        style={{ animation: 'faceScanLineSVG 2s linear infinite' }}
      />
    </svg>
  )
}
