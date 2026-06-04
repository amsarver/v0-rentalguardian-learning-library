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
  // For PowerPoint, we show download UI immediately since browsers can't render .pptx
  const [loading, setLoading] = useState(fileType === 'pdf')
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The API route URL for fetching the file
  const fileApiUrl = `/api/presentations/file?pathname=${encodeURIComponent(pathname)}`

  useEffect(() => {
    // Prevent body scroll when viewer is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError('Failed to load presentation. Try downloading instead.')
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Fetch the file through our API route
      const response = await fetch(fileApiUrl)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }

      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = pathname.split('/').pop() || 'presentation'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download file. Please try again.')
    } finally {
      setDownloading(false)
    }
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
            disabled={downloading}
            className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? 'Downloading...' : 'Download'}
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
        {loading && fileType === 'pdf' && (
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
                disabled={downloading}
                className="bg-[#3AAAE1] hover:bg-[#2d8ab8] text-white gap-2"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? 'Downloading...' : 'Download to View'}
              </Button>
            </div>
          </div>
        )}
        
        {/* PowerPoint - Show download prompt since browsers can't render .pptx natively */}
        {fileType === 'powerpoint' && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col items-center gap-6 text-[#1D3E6E] p-8 text-center max-w-md">
              <div className="w-24 h-24 bg-[#F5A623]/10 rounded-2xl flex items-center justify-center">
                <Presentation className="h-12 w-12 text-[#F5A623]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[#1D3E6E]/60">
                  Click the button below to download this presentation and open it in PowerPoint or your default presentation app.
                </p>
              </div>
              <Button
                onClick={handleDownload}
                disabled={downloading}
                size="lg"
                className="bg-[#3AAAE1] hover:bg-[#2d8ab8] text-white gap-2 px-8"
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                {downloading ? 'Downloading...' : 'Download Presentation'}
              </Button>
            </div>
          </div>
        )}

        {/* PDF Viewer - Use object tag to display through our API */}
        {fileType === 'pdf' && !error && (
          <object
            data={fileApiUrl}
            type="application/pdf"
            className="absolute inset-0 w-full h-full z-10"
            onLoad={handleLoad}
            onError={handleError}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-4 text-[#1D3E6E] p-8 text-center">
                <FileText className="h-16 w-16 text-[#1D3E6E]" />
                <p className="text-lg font-medium">Unable to display PDF in browser</p>
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-[#3AAAE1] hover:bg-[#2d8ab8] text-white gap-2"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? 'Downloading...' : 'Download to View'}
                </Button>
              </div>
            </div>
          </object>
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
