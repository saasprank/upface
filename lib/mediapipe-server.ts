/**
 * MediaPipe Face Landmarker – server-side (Node.js / Next.js API route)
 *
 * Polyfills for the browser APIs MediaPipe requires when running in Node.js,
 * then exposes a singleton FaceLandmarker and a scoring function.
 */

// Polyfills Node.js pour MediaPipe Tasks Vision
if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
    }),
    createElementNS: () => ({
      style: {},
      setAttribute: () => {},
    }),
  }
}
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = globalThis
}
if (typeof globalThis.navigator === 'undefined') {
  (globalThis as any).navigator = { userAgent: 'node' }
}
if (typeof globalThis.self === 'undefined') {
  (globalThis as any).self = globalThis
}

// ─── Node.js polyfills (must run before any mediapipe import) ─────────────────

if (typeof globalThis.ImageData === 'undefined') {
  class _ImageData {
    readonly data: Uint8ClampedArray
    readonly width: number
    readonly height: number
    readonly colorSpace: PredefinedColorSpace = 'srgb'

    constructor(data: Uint8ClampedArray, width: number, height?: number) {
      this.data = data
      this.width = width
      this.height = height ?? data.length / (width * 4)
    }
  }
  // @ts-expect-error – Node.js polyfill
  globalThis.ImageData = _ImageData
}

// ─── Imports ──────────────────────────────────────────────────────────────────

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import sharp from 'sharp'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaPipeScores {
  symetrie: number
  proportions: number
  structure: number
  detected: boolean
  landmarks?: NormalizedLandmark[]
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _landmarker: FaceLandmarker | null = null
let _initPromise: Promise<FaceLandmarker> | null = null

async function getLandmarker(): Promise<FaceLandmarker> {
  if (_landmarker) return _landmarker
  if (_initPromise) return _initPromise

  _initPromise = (async () => {
    // Point FilesetResolver to the locally bundled WASM files
    const wasmDir = pathToFileURL(
      path.join(process.cwd(), 'node_modules', '@mediapipe', 'tasks-vision', 'wasm')
    ).href

    let filesetResolver: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>

    try {
      filesetResolver = await FilesetResolver.forVisionTasks(wasmDir)
    } catch {
      // Fallback to CDN if local WASM path fails (e.g. file:// fetch unsupported)
      filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
      )
    }

    const modelPath = path.join(process.cwd(), 'public', 'models', 'face_landmarker.task')
    const modelBuffer = new Uint8Array(fs.readFileSync(modelPath))

    const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetBuffer: modelBuffer,
        delegate: 'CPU',
      },
      runningMode: 'IMAGE',
      numFaces: 1,
      outputFaceBlendshapes: true,
    })

    _landmarker = landmarker
    return landmarker
  })()

  return _initPromise
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

/** Clamp a value to [0, 100] and round to integer */
function score(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)))
}

/**
 * SYMÉTRIE
 * Mesure l'offset horizontal du nez (pt 4) par rapport au centre
 * inter-oculaire (pt 33 ↔ pt 263).
 * Un visage parfaitement symétrique a un offset de 0 → score 100.
 */
function calcSymetrie(lm: NormalizedLandmark[]): number {
  const eyeCenterX = (lm[33].x + lm[263].x) / 2
  const noseOffset = Math.abs(lm[4].x - eyeCenterX)
  // noseOffset ≈ 0.00 (parfait) → 0.05+ (forte asymétrie)
  return score(100 - noseOffset * 2000)
}

/**
 * PROPORTIONS — ratio doré
 * Compare le ratio hauteur/largeur du visage à Phi (1.618).
 */
function calcProportions(lm: NormalizedLandmark[]): number {
  const faceHeight = Math.abs(lm[152].y - lm[10].y)
  const faceWidth  = Math.abs(lm[397].x - lm[172].x)
  if (faceWidth === 0) return 50
  const ratio = faceHeight / faceWidth
  const PHI = 1.618
  const deviation = Math.abs(ratio - PHI) / PHI
  // deviation 0 → 100, deviation 0.5+ → 0
  return score(100 - deviation * 200)
}

/**
 * STRUCTURE — angle mandibulaire
 * Calcule l'angle au menton entre les vecteurs chin→jaw_left et chin→jaw_right.
 * Angle idéal ≈ 115–120°.
 */
function calcStructure(lm: NormalizedLandmark[]): number {
  const chin = lm[152]
  const jawL = lm[172]
  const jawR = lm[397]

  const vL = { x: jawL.x - chin.x, y: jawL.y - chin.y }
  const vR = { x: jawR.x - chin.x, y: jawR.y - chin.y }

  const magL = Math.sqrt(vL.x ** 2 + vL.y ** 2)
  const magR = Math.sqrt(vR.x ** 2 + vR.y ** 2)
  if (magL === 0 || magR === 0) return 50

  const cosAngle = (vL.x * vR.x + vL.y * vR.y) / (magL * magR)
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI)

  const IDEAL = 117.5
  const deviation = Math.abs(angle - IDEAL)
  // deviation 0 → 100, deviation 50+ → 0
  return score(100 - deviation * 2)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Analyse un visage à partir d'un Buffer image.
 * Retourne les 3 scores objectifs (symétrie, proportions, structure) et
 * un flag detected indiquant si un visage a été trouvé.
 */
export async function analyzeFaceWithMediaPipe(
  imageBuffer: Buffer
): Promise<MediaPipeScores> {
  // 1. Decode & resize with sharp → raw RGBA bytes
  const { data, info } = await sharp(imageBuffer)
    .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const width  = info.width
  const height = info.height

  // 2. Wrap in ImageData (polyfilled in Node.js)
  const ImageDataCtor = globalThis.ImageData as unknown as new (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => ImageData

  const imageData = new ImageDataCtor(new Uint8ClampedArray(data), width, height)

  // 3. Run detection
  const landmarker = await getLandmarker()
  const result = landmarker.detect(imageData)

  if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
    return { symetrie: 0, proportions: 0, structure: 0, detected: false }
  }

  const lm = result.faceLandmarks[0]

  return {
    symetrie:     calcSymetrie(lm),
    proportions:  calcProportions(lm),
    structure:    calcStructure(lm),
    detected:     true,
    landmarks:    lm,
  }
}
