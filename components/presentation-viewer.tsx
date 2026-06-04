'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import JSZip from 'jszip'

interface PresentationViewerProps {
  url: string
  pathname: string
  title: string
  fileType: 'pdf' | 'powerpoint'
  onClose: () => void
}

interface SlideImage {
  index: number
  dataUrl: string
}

export function PresentationViewer({ pathname, title, fileType, onClose }: PresentationViewerProps) {
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slides, setSlides] = useState<SlideImage[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const fileApiUrl = `/api/presentations/file?pathname=${encodeURIComponent(pathname)}`

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Load PowerPoint and extract slide images
  useEffect(() => {
    if (fileType !== 'powerpoint') {
      setLoading(false)
      return
    }

    const loadPptx = async () => {
      try {
        const response = await fetch(fileApiUrl)
        if (!response.ok) throw new Error('Failed to fetch presentation')
        
        const arrayBuffer = await response.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)
        
        // Find all slide images in the PPTX (they're stored in ppt/media/)
        const mediaFiles: SlideImage[] = []
        const slideRels: Map<number, string[]> = new Map()
        
        // Parse slide relationships to find which images belong to which slide
        const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/))
        
        for (const slideFile of slideFiles) {
          const slideNum = parseInt(slideFile.match(/slide(\d+)\.xml$/)?.[1] || '0')
          const relFile = slideFile.replace('slides/', 'slides/_rels/').replace('.xml', '.xml.rels')
          
          if (zip.files[relFile]) {
            const relContent = await zip.files[relFile].async('text')
            const imageMatches = relContent.matchAll(/Target="\.\.\/media\/(image\d+\.[a-z]+)"/gi)
            const images: string[] = []
            for (const match of imageMatches) {
              images.push(match[1])
            }
            slideRels.set(slideNum, images)
          }
        }

        // Extract all media files
        const mediaEntries = Object.entries(zip.files).filter(([name]) => 
          name.startsWith('ppt/media/') && !name.endsWith('/')
        )

        // Create a simple slide preview using the embedded images
        // For a more complete solution, we'd need to render the full XML
        const extractedSlides: SlideImage[] = []
        
        // Sort slides by number
        const sortedSlideNums = Array.from(slideRels.keys()).sort((a, b) => a - b)
        
        for (let i = 0; i < sortedSlideNums.length; i++) {
          const slideNum = sortedSlideNums[i]
          const slideImages = slideRels.get(slideNum) || []
          
          // Try to get the main image for this slide
          if (slideImages.length > 0) {
            const imageName = slideImages[0]
            const mediaFile = zip.files[`ppt/media/${imageName}`]
            if (mediaFile) {
              const blob = await mediaFile.async('blob')
              const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.readAsDataURL(blob)
              })
              extractedSlides.push({ index: i, dataUrl })
            }
          }
        }

        // If we couldn't extract slide images, try getting all images from media folder
        if (extractedSlides.length === 0 && mediaEntries.length > 0) {
          for (let i = 0; i < mediaEntries.length; i++) {
            const [, file] = mediaEntries[i]
            const blob = await file.async('blob')
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            extractedSlides.push({ index: i, dataUrl })
          }
        }

        if (extractedSlides.length > 0) {
          setSlides(extractedSlides)
        } else {
          // No images found - show download option
          setError('This presentation contains complex content. Please download to view.')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error loading PPTX:', err)
        setError('Unable to preview this presentation. Please download to view.')
        setLoading(false)
      }
    }

    loadPptx()
  }, [fileType, fileApiUrl])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(fileApiUrl)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
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

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, slides.length, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-[#1D3E6E]/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1D3E6E] border-b border-white/10">
        <h2 className="text-lg font-semibold text-white truncate max-w-[50%]">{title}</h2>
        <div className="flex items-center gap-2">
          {fileType === 'powerpoint' && slides.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white/60 text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-white/20 mx-2" />
            </>
          )}
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
      <div className="flex-1 relative bg-gray-900 overflow-hidden" ref={containerRef}>
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#3AAAE1]" />
              <p>Loading presentation...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="flex flex-col items-center gap-4 text-white p-8 text-center max-w-md">
              <p className="text-lg">{error}</p>
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
                {downloading ? 'Downloading...' : 'Download Presentation'}
              </Button>
            </div>
          </div>
        )}
        
        {/* PowerPoint Slide Viewer */}
        {fileType === 'powerpoint' && slides.length > 0 && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4">
            <div 
              className="relative transition-transform duration-200 shadow-2xl"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={slides[currentSlide]?.dataUrl}
                alt={`Slide ${currentSlide + 1}`}
                className="max-w-full max-h-[calc(100vh-200px)] object-contain bg-white"
              />
            </div>

            {/* Navigation arrows */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        )}

        {/* PDF Viewer */}
        {fileType === 'pdf' && !error && (
          <object
            data={fileApiUrl}
            type="application/pdf"
            className="absolute inset-0 w-full h-full z-10"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setError('Failed to load PDF. Try downloading instead.')
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center gap-4 text-white p-8 text-center">
                <p className="text-lg">Unable to display PDF in browser</p>
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

      {/* Footer with slide navigation */}
      <div className="px-4 py-3 bg-[#1D3E6E] border-t border-white/10">
        {fileType === 'powerpoint' && slides.length > 0 ? (
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/70 text-sm">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-[#3AAAE1] w-4' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-white/50 text-center">
            RentalGuardian Learning Library
          </p>
        )}
      </div>
    </div>
  )
}
