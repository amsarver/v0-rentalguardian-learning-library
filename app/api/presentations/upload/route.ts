import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
]

const ALLOWED_EXTENSIONS = ['.ppt', '.pptx', '.pdf']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))
    const hasValidType = ALLOWED_TYPES.includes(file.type)

    if (!hasValidExtension && !hasValidType) {
      return NextResponse.json(
        { error: 'Only PowerPoint (.ppt, .pptx) and PDF files are allowed' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob with public access (required for Office Online embed)
    const blob = await put(`presentations/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Determine file type for viewer
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : 'powerpoint'

    // Return the URL for direct access
    return NextResponse.json({
      success: true,
      presentation: {
        url: blob.url,
        pathname: blob.pathname,
        title: title || file.name.replace(/\.(pptx?|pdf)$/i, ''),
        description: description || '',
        uploadedAt: new Date().toISOString(),
        size: file.size,
        fileType,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
