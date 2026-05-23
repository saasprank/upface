'use client'

import { useCallback, useRef, useState } from 'react'
import ScanAnimation from '@/components/ui/ScanAnimation'

interface AnalyzeUploadScreenProps {
  onFile: (file: File) => void
  loading?: boolean
  dropzoneLabel: string
  formatsLabel: string
  choosePhotoLabel: string
  footerLabel: string
  dragLabel?: string
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/heic', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

function CornerBrackets() {
  const base = 'pointer-events-none absolute h-5 w-5 border-[#3B82F6]'
  return (
    <>
      <span className={`${base} left-4 top-4 border-l-2 border-t-2`} aria-hidden />
      <span className={`${base} right-4 top-4 border-r-2 border-t-2`} aria-hidden />
      <span className={`${base} bottom-4 left-4 border-b-2 border-l-2`} aria-hidden />
      <span className={`${base} bottom-4 right-4 border-b-2 border-r-2`} aria-hidden />
    </>
  )
}

export default function AnalyzeUploadScreen({
  onFile,
  loading = false,
  dropzoneLabel,
  formatsLabel,
  choosePhotoLabel,
  footerLabel,
  dragLabel = 'Relâche ici',
}: AnalyzeUploadScreenProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      if (!ACCEPTED.includes(file.type)) {
        setError('Format non supporté. Utilisez JPG, PNG, HEIC ou WEBP.')
        return
      }
      if (file.size > MAX_SIZE) {
        setError('Fichier trop lourd. Maximum 10 MB.')
        return
      }
      onFile(file)
    },
    [onFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && !loading) handleFile(file)
    },
    [handleFile, loading],
  )

  const openPicker = useCallback(() => {
    if (!loading) inputRef.current?.click()
  }, [loading])

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <div
        onClick={openPicker}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          if (!loading) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragging ? 'scale-[1.01] border-[#06B6D4] bg-[rgba(59,130,246,0.08)]' : 'border-[#3B82F6] bg-[#0D1321] hover:border-[#06B6D4]/80'
        } ${loading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <CornerBrackets />

        <ScanAnimation fill className="opacity-60" />

        <div className="relative z-10 flex flex-col items-center">
          <svg
            className="mb-6 h-12 w-12 text-[#3B82F6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <p className="font-[Outfit,sans-serif] text-[20px] font-bold text-white">
            {dragging ? dragLabel : dropzoneLabel}
          </p>
          <p className="mt-2 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3]">{formatsLabel}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openPicker()
            }}
            disabled={loading}
            className="mt-8 h-12 w-full max-w-[280px] rounded-full font-[Outfit,sans-serif] text-[14px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(6,182,212,0.2)',
            }}
          >
            {loading ? '…' : choosePhotoLabel}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center font-[Inter,sans-serif] text-xs text-red-400">{error}</p>
      )}

      <p className="mt-4 text-center font-[Inter,sans-serif] text-[11px] uppercase tracking-[0.08em] text-[#3D4F6E]">
        {footerLabel}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
