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

export function PresentationViewer({ url, title, fileType, onClose }: PresentationViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Microsoft Office Online embed URL for PowerPoint (requires public URL)
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  
  // Google Docs Viewer for PDFs (also requires public URL)
  const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError('Failed to load presentation')
  }

  const handleDownload = () => {
    window.open(url, '_blank')
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
        
        {/* PowerPoint Viewer - Microsoft Office Online */}
        {fileType === 'powerpoint' && (
          <iframe
            src={officeViewerUrl}
            className="absolute inset-0 w-full h-full z-10"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* PDF Viewer - Google Docs Viewer */}
        {fileType === 'pdf' && (
          <iframe
            src={pdfViewerUrl}
            className="absolute inset-0 w-full h-full z-10"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
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
