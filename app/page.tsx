'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, BookOpen, Loader2, Library } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadModal } from '@/components/upload-modal'
import { PresentationCard } from '@/components/presentation-card'
import { PresentationViewer } from '@/components/presentation-viewer'

interface Presentation {
  url: string
  pathname: string
  title: string
  uploadedAt: string
  size: number
  fileType: 'pdf' | 'powerpoint'
}

export default function LearningLibraryPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null)

  const fetchPresentations = useCallback(async () => {
    try {
      const response = await fetch('/api/presentations/list')
      if (response.ok) {
        const data = await response.json()
        setPresentations(data.presentations)
      }
    } catch (error) {
      console.error('Error fetching presentations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPresentations()
  }, [fetchPresentations])

  const handleUploadSuccess = () => {
    fetchPresentations()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-[#1D3E6E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3AAAE1] rounded-lg flex items-center justify-center">
                <Library className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">RentalGuardian</h1>
                <p className="text-sm text-white/70">Learning Library</p>
              </div>
            </div>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-[#3AAAE1] hover:bg-[#3AAAE1]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Presentation
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1D3E6E] to-[#1D3E6E]/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to the Learning Library</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto text-pretty">
            Access training materials, product guides, and educational resources to help you 
            get the most out of RentalGuardian services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#3AAAE1]" />
            <h3 className="text-xl font-semibold text-foreground">Presentations</h3>
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#F5A623]/10 text-[#F5A623] rounded-full">
              {presentations.length} {presentations.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#3AAAE1]" />
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <div className="w-16 h-16 bg-[#3AAAE1]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-[#3AAAE1]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No presentations yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first presentation to get started.
            </p>
            <Button
              onClick={() => setUploadModalOpen(true)}
              className="bg-[#1D3E6E] hover:bg-[#1D3E6E]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Presentation
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {presentations.map((presentation) => (
              <PresentationCard
                key={presentation.pathname}
                presentation={presentation}
                onClick={() => setSelectedPresentation(presentation)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1D3E6E] text-white/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RentalGuardian. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {selectedPresentation && (
        <PresentationViewer
          url={selectedPresentation.url}
          title={selectedPresentation.title}
          fileType={selectedPresentation.fileType}
          onClose={() => setSelectedPresentation(null)}
        />
      )}
    </div>
  )
}
