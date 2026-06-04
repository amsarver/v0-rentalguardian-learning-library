'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Download, FileText, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PresentationViewerProps {
  url: string
  pathname: string
  title: string
  fileType: 'pdf' | 'powerpoint'
  onClose: () => void
}

export function PresentationViewer({ pathname, title, fileType, onClose }: PresentationViewerProps) {
  // For PowerPoint, we don't need to load anything - we show download UI immediately
  const [loading, setLoading] = useState(fileType === 'pdf')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Use our proxy route to serve the file
  const proxyUrl = `/api/presentations/file?pathname=${encodeURIComponent(pathname)}`

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError('Failed to load presentation')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = proxyUrl
    link.download = title + (fileType === 'powerpoint' ? '.pptx' : '.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1D3E6E]/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1D3E6E] border-b border-white/10">
        <h2 className="text-lg font-semibold text-white truncate max-w-[50%]">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="flex flex-col items-center gap-3 text-[#1D3E6E]">
              <Loader2 className="h-8 w-8 animate-spin text-[#3AAAE1]" />
              <p>Loading presentation...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="flex flex-col items-center gap-4 text-[#1D3E6E] p-8 text-center">
              {fileType === 'powerpoint' ? (
                <Presentation className="h-16 w-16 text-[#F5A623]" />
              ) : (
                <FileText className="h-16 w-16 text-[#1D3E6E]" />
              )}
              <p className="text-lg font-medium">{error}</p>
              <Button
                onClick={handleDownload}
                className="bg-[#3AAAE1] hover:bg-[#2d8ab8] text-white gap-2"
              >
                <Download className="h-4 w-4" />
                Download to View
              </Button>
            </div>
          </div>
        )}
        
        {/* PDF Viewer - browsers have native PDF support */}
        {fileType === 'pdf' && (
          <object
            data={proxyUrl}
            type="application/pdf"
            className="absolute inset-0 w-full h-full z-10"
            onLoad={handleLoad}
            onError={handleError}
          >
            <iframe
              src={proxyUrl}
              className="absolute inset-0 w-full h-full"
              title={title}
              onLoad={handleLoad}
              onError={handleError}
            />
          </object>
        )}

        {/* PowerPoint - Show download prompt since browsers can't natively display .pptx */}
        {fileType === 'powerpoint' && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 z-10">
            <div className="flex flex-col items-center gap-6 p-8 text-center max-w-md">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#F5A623] to-[#e09520] flex items-center justify-center shadow-lg">
                <Presentation className="h-12 w-12 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1D3E6E] mb-2">{title}</h3>
                <p className="text-[#1D3E6E]/70 mb-6">
                  PowerPoint presentations require Microsoft PowerPoint or a compatible application to view.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleDownload}
                  className="w-full bg-[#1D3E6E] hover:bg-[#15304f] text-white gap-2 h-12"
                >
                  <Download className="h-5 w-5" />
                  Download Presentation
                </Button>
                <p className="text-xs text-[#1D3E6E]/50">
                  Opens in PowerPoint, Google Slides, or your default presentation app
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-[#1D3E6E] border-t border-white/10 text-center">
        <p className="text-xs text-white/50">
          RentalGuardian Learning Library
        </p>
      </div>
    </div>
  )
}
