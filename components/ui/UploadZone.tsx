'use client'

import { useCallback, useRef, useState } from 'react'
import ScanAnimation from './ScanAnimation'
import Image from 'next/image'

interface UploadZoneProps {
  onFile: (file: File) => void
  preview?: string | null
  loading?: boolean
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/heic', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

export default function UploadZone({ onFile, preview, loading }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
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
  }, [onFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="w-full">
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${dragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : preview
              ? 'border-blue-500/30 bg-surface'
              : 'border-blue-500/20 bg-surface hover:border-blue-500/50 hover:bg-surface-2'
          }
        `}
        style={{ minHeight: 280 }}
      >
        {preview ? (
          <div className="relative w-full h-[280px] flex items-center justify-center p-4">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-blue-500/20">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
            {loading && (
              <div className="absolute inset-0">
                <ScanAnimation height={280} />
              </div>
            )}
            {!loading && (
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-[rgba(15,23,42,0.08)] rounded-lg px-3 py-1.5 text-xs text-muted">
                Cliquer pour changer
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center h-[280px]">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <div>
              <p className="text-theme font-medium text-sm">
                {dragging ? 'Relâchez ici' : 'Glisse-dépose ta photo ici'}
              </p>
              <p className="text-faint text-xs mt-1">ou clique pour parcourir</p>
            </div>

            <p className="text-faint text-xs">
              JPG, PNG, HEIC, WEBP · Max 10MB
            </p>

            <ScanAnimation className="absolute inset-0 opacity-30 pointer-events-none" height={280} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
