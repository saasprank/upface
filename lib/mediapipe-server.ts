/**
 * MediaPipe Face Landmarker – server-side (Node.js / Next.js API route)
 *
 * Polyfills for the browser APIs MediaPipe requires when running in Node.js,
 * then exposes a singleton FaceLandmarker and a scoring function.
 */

import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

function createMockElement() {
  return {
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => createMockElement(),
    removeChild: () => createMockElement(),
  }
}

function applyNodePolyfillsForMediaPipe() {
  if ((globalThis as typeof globalThis & { __upfaceMpPolyfills?: boolean }).__upfaceMpPolyfills) return

  // Polyfills Node.js pour MediaPipe Tasks Vision
  if (typeof globalThis.document === 'undefined') {
    const body = createMockElement()
    ;(globalThis as any).document = {
      createElement: () => createMockElement(),
      createElementNS: () => createMockElement(),
      addEventListener: () => {},
      removeEventListener: () => {},
      body,
      documentElement: body,
    }
  }
  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = {
      document: (globalThis as any).document,
      navigator: (globalThis as any).navigator ?? { userAgent: 'node' },
      addEventListener: () => {},
      removeEventListener: () => {},
      fetch: globalThis.fetch.bind(globalThis),
      performance: globalThis.performance,
    }
  }
  if (typeof globalThis.navigator === 'undefined') {
    (globalThis as any).navigator = { userAgent: 'node' }
  }
  if (typeof globalThis.self === 'undefined') {
    (globalThis as any).self = globalThis
  }

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

  ;(globalThis as typeof globalThis & { __upfaceMpPolyfills?: boolean }).__upfaceMpPolyfills = true
}

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
    applyNodePolyfillsForMediaPipe()

    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')

    // En serverless (Vercel), file:// WASM local peut bloquer — CDN jsDelivr directement
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
    )

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

/** Clamp a value to [0, 100] and round to integer */
function score(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)))
}

function calcSymetrie(lm: NormalizedLandmark[]): number {
  const eyeCenterX = (lm[33].x + lm[263].x) / 2
  const noseOffset = Math.abs(lm[4].x - eyeCenterX)
  return score(100 - noseOffset * 2000)
}

function calcProportions(lm: NormalizedLandmark[]): number {
  const faceHeight = Math.abs(lm[152].y - lm[10].y)
  const faceWidth  = Math.abs(lm[397].x - lm[172].x)
  if (faceWidth === 0) return 50
  const ratio = faceHeight / faceWidth
  const PHI = 1.618
  const deviation = Math.abs(ratio - PHI) / PHI
  return score(100 - deviation * 200)
}

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
  return score(100 - deviation * 2)
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzeFaceWithMediaPipe(
  imageBuffer: Buffer
): Promise<MediaPipeScores> {
  applyNodePolyfillsForMediaPipe()

  const { data, info } = await sharp(imageBuffer)
    .resize(640, 640, { fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const width  = info.width
  const height = info.height

  const ImageDataCtor = globalThis.ImageData as unknown as new (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => ImageData

  const imageData = new ImageDataCtor(new Uint8ClampedArray(data), width, height)

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
