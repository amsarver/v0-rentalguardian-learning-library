'use client'

import { FileText, Calendar, HardDrive, Presentation } from 'lucide-react'

interface PresentationData {
  url: string
  pathname: string
  title: string
  uploadedAt: string
  size: number
  fileType: 'pdf' | 'powerpoint'
}

interface PresentationCardProps {
  presentation: PresentationData
  onClick: () => void
}

export function PresentationCard({ presentation, onClick }: PresentationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
  }

  const isPowerPoint = presentation.fileType === 'powerpoint'

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-card rounded-lg border border-border p-5 hover:border-[#3AAAE1] hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-14 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-colors ${
          isPowerPoint ? 'bg-[#F5A623]' : 'bg-[#1D3E6E]'
        }`}>
          {isPowerPoint ? (
            <Presentation className="h-6 w-6 text-white" />
          ) : (
            <FileText className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-[#3AAAE1] transition-colors truncate">
            {presentation.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(presentation.uploadedAt)}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="h-3.5 w-3.5" />
              {formatSize(presentation.size)}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              isPowerPoint 
                ? 'bg-[#F5A623]/10 text-[#F5A623]' 
                : 'bg-[#3AAAE1]/10 text-[#3AAAE1]'
            }`}>
              {isPowerPoint ? 'PowerPoint' : 'PDF'}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1D3E6E]/10 text-[#1D3E6E]">
            Click to View
          </span>
        </div>
      </div>
    </button>
  )
}
