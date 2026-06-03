'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, Loader2, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

const ACCEPTED_TYPES = '.ppt,.pptx,.pdf'
const ACCEPTED_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
]

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const isValidFile = (f: File) => {
    const fileName = f.name.toLowerCase()
    const hasValidExtension = fileName.endsWith('.ppt') || fileName.endsWith('.pptx') || fileName.endsWith('.pdf')
    const hasValidType = ACCEPTED_MIME_TYPES.includes(f.type)
    return hasValidExtension || hasValidType
  }

  const getFileIcon = (f: File) => {
    const fileName = f.name.toLowerCase()
    if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      return <Presentation className="h-8 w-8 text-[#F5A623]" />
    }
    return <FileText className="h-8 w-8 text-[#3AAAE1]" />
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile)
      if (!title) {
        setTitle(droppedFile.name.replace(/\.(pptx?|pdf)$/i, ''))
      }
    } else {
      setError('Please upload a PowerPoint (.ppt, .pptx) or PDF file')
    }
  }, [title])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const selectedFile = e.target.files?.[0]
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name.replace(/\.(pptx?|pdf)$/i, ''))
      }
    } else if (selectedFile) {
      setError('Please upload a PowerPoint (.ppt, .pptx) or PDF file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)

      const response = await fetch('/api/presentations/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      onUploadSuccess()
      handleClose()
    } catch {
      setError('Failed to upload presentation. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card w-full max-w-lg rounded-lg p-6 shadow-xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1D3E6E]">Upload Presentation</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-[#3AAAE1] bg-[#3AAAE1]/5'
              : 'border-border hover:border-[#3AAAE1]/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              {getFileIcon(file)}
              <div className="text-left">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-[#3AAAE1] mx-auto mb-4" />
              <p className="text-foreground mb-2">
                Drag and drop your file here, or{' '}
                <label className="text-[#3AAAE1] cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </p>
              <p className="text-sm text-muted-foreground">PowerPoint (.ppt, .pptx) or PDF files</p>
            </>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Presentation title"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#3AAAE1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the presentation"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#3AAAE1] resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-[#1D3E6E] hover:bg-[#1D3E6E]/90 text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Presentation'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
