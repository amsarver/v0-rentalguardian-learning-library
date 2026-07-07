'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, BookOpen, Loader2, ShieldCheck, Plane, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadModal } from '@/components/upload-modal'
import { PresentationCard } from '@/components/presentation-card'
import { PresentationViewer } from '@/components/presentation-viewer'
import { ChatWidget } from '@/components/chat-widget'
import { QASection } from '@/components/qa-section'
import { CATEGORIES, resolveCategory, type CategoryId } from '@/lib/categories'

interface Presentation {
  url: string
  pathname: string
  title: string
  uploadedAt: string
  size: number
  fileType: 'pdf' | 'powerpoint'
  category?: CategoryId
}

const CATEGORY_ICONS: Record<CategoryId, typeof ShieldCheck> = {
  damage: ShieldCheck,
  travel: Plane,
  billing: CreditCard,
}

export default function LearningLibraryPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null)
  const [qaRefreshTrigger, setQaRefreshTrigger] = useState(0)

  const fetchPresentations = useCallback(async () => {
    try {
      const response = await fetch('/api/presentations/list')
      if (response.ok) {
        const data = await response.json()
        
        // Merge with localStorage metadata (for title/description)
        const localData = JSON.parse(localStorage.getItem('rg-presentations') || '[]')
        const localMap = new Map(localData.map((p: Presentation & { description?: string }) => [p.url, p]))
        
        // Only use presentations that exist in Blob storage
        const blobUrls = new Set(data.presentations.map((p: Presentation) => p.url))
        
        const merged = data.presentations.map((p: Presentation) => {
          const local = localMap.get(p.url)
          // Check for custom title overrides
          const customTitles = JSON.parse(localStorage.getItem('rg-custom-titles') || '{}')
          const customTitle = Object.entries(customTitles).find(([key]) => p.title.includes(key))?.[1] as string | undefined

          const resolvedTitle = local
            ? customTitle || (local as Presentation).title || p.title
            : customTitle || p.title
          const category = resolveCategory(p.url, resolvedTitle)

          if (local) {
            return { ...p, title: resolvedTitle, description: (local as Presentation & { description?: string }).description, category }
          }
          return { ...p, title: resolvedTitle, category }
        })
        
        // Clean up localStorage by removing entries that no longer exist in Blob
        const cleanedLocalData = localData.filter((p: Presentation) => blobUrls.has(p.url))
        localStorage.setItem('rg-presentations', JSON.stringify(cleanedLocalData))
        
        setPresentations(merged)
      }
    } catch (error) {
      console.error('Error fetching presentations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Set custom title for the presentation
    const customTitles: Record<string, string> = {
      'RentalGuardian Smart.ly and mySedgwick Compressed': 'RentalGuardian Smart.ly and mySedgwick Claims Process'
    }
    localStorage.setItem('rg-custom-titles', JSON.stringify(customTitles))
    fetchPresentations()
  }, [fetchPresentations])

  const handleUploadSuccess = () => {
    fetchPresentations()
    // Trigger Q&A section refresh after a short delay to allow text extraction
    setTimeout(() => setQaRefreshTrigger(prev => prev + 1), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-[#1D3E6E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RentalGuardian_Logo__Horizontal_White_BI-YrZrnDozzIs6EWlGh5FC05rHdFv4xH.png"
                alt="RentalGuardian"
                className="h-12 w-auto"
              />
              <div className="h-8 w-px bg-white/30" />
              <p className="text-lg font-medium text-white/90">Learning Library</p>
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
          <h2 className="text-3xl font-bold mb-4">Welcome to the RentalGuardian Learning Library</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto text-pretty">
            Access training materials, product guides, and educational resources to help you 
            get the most out of RentalGuardian services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
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
          <div className="flex flex-col gap-10">
            {CATEGORIES.map((category) => {
              const items = presentations.filter(
                (p) => (p.category ?? 'damage') === category.id,
              )
              const CategoryIcon = CATEGORY_ICONS[category.id]

              return (
                <section key={category.id} aria-labelledby={`category-${category.id}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon className="h-5 w-5 text-[#3AAAE1]" />
                    <h3
                      id={`category-${category.id}`}
                      className="text-xl font-semibold text-foreground"
                    >
                      {category.label}
                    </h3>
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#F5A623]/10 text-[#F5A623] rounded-full">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty">
                    {category.description}
                  </p>

                  {items.length === 0 ? (
                    <div className="text-center py-10 bg-card rounded-lg border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">
                        No resources in this category yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {items.map((presentation) => (
                        <PresentationCard
                          key={presentation.pathname}
                          presentation={presentation}
                          onClick={() => setSelectedPresentation(presentation)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}

        {/* Q&A Section */}
        <div className="mt-12">
          <QASection refreshTrigger={qaRefreshTrigger} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1D3E6E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RentalGuardian_Logo__Horizontal_White_BI-YrZrnDozzIs6EWlGh5FC05rHdFv4xH.png"
              alt="RentalGuardian"
              className="h-10 w-auto opacity-90"
            />
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} RentalGuardian. All rights reserved.
            </p>
          </div>
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
          pathname={selectedPresentation.pathname}
          title={selectedPresentation.title}
          fileType={selectedPresentation.fileType}
          onClose={() => setSelectedPresentation(null)}
        />
      )}

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  )
}
