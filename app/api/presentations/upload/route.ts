import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const ALLOWED_EXTENSIONS = ['.ppt', '.pptx', '.pdf']
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string || ''
    const description = formData.get('description') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))
    const hasValidMimeType = ALLOWED_MIME_TYPES.includes(file.type)

    if (!hasValidExtension && !hasValidMimeType) {
      return NextResponse.json(
        { error: 'Only PowerPoint (.ppt, .pptx) and PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Determine file type
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : 'powerpoint'

    // Upload to Vercel Blob with private access
    const blob = await put(
      `presentations/${Date.now()}-${file.name}`,
      file,
      { access: 'private' }
    )

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      title: title || file.name.replace(/\.(pptx?|pdf)$/i, ''),
      description,
      fileType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
