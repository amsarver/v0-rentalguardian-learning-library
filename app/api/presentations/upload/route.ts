import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    // Upload to Vercel Blob with private access
    const blob = await put(`presentations/${Date.now()}-${file.name}`, file, {
      access: 'private',
    })

    // Return the pathname for storage
    return NextResponse.json({
      success: true,
      presentation: {
        pathname: blob.pathname,
        title: title || file.name.replace('.pdf', ''),
        description: description || '',
        uploadedAt: new Date().toISOString(),
        size: file.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
