'use client'

import { useEffect } from 'react'
import { X, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PresentationViewerProps {
  url: string
  title: string
  fileType: 'pdf' | 'powerpoint'
  onClose: () => void
}

export function PresentationViewer({ url, title, fileType, onClose }: PresentationViewerProps) {
  useEffect(() => {
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // For PowerPoint files, use Microsoft Office Online viewer
  // For PDF files, use the browser's built-in PDF viewer via object tag
  const getEmbedUrl = () => {
    if (fileType === 'powerpoint') {
      // Microsoft Office Online viewer URL
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    }
    // For PDF, use the direct URL with Google Docs viewer as fallback
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
  }

  const embedUrl = getEmbedUrl()

  return (
    <div className="fixed inset-0 z-50 bg-[#1D3E6E]/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1D3E6E] border-b border-white/10">
        <h2 className="text-lg font-semibold text-white truncate max-w-[50%]">{title}</h2>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open Original
          </a>
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

      {/* Embed Content */}
      <div className="flex-1 relative bg-white">
        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
          <div className="flex flex-col items-center gap-3 text-[#1D3E6E]">
            <Loader2 className="h-8 w-8 animate-spin text-[#3AAAE1]" />
            <p>Loading presentation...</p>
          </div>
        </div>
        
        {/* Iframe for the viewer */}
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full z-10"
          frameBorder="0"
          allowFullScreen
          title={title}
        />
      </div>

      {/* Footer with Microsoft branding note */}
      <div className="px-4 py-2 bg-[#1D3E6E] border-t border-white/10 text-center">
        <p className="text-xs text-white/50">
          {fileType === 'powerpoint' 
            ? 'Powered by Microsoft Office Online' 
            : 'Powered by Google Docs Viewer'}
        </p>
      </div>
    </div>
  )
}
