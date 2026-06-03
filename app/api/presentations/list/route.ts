import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'presentations/',
    })

    const presentations = blobs.map((blob) => {
      const filename = blob.pathname.split('/').pop() || 'unknown'
      const isPdf = filename.toLowerCase().endsWith('.pdf')
      const fileType = isPdf ? 'pdf' : 'powerpoint'
      
      // Clean up the title by removing timestamp prefix and extension
      const cleanTitle = filename
        .replace(/^\d+-/, '')
        .replace(/\.(pptx?|pdf)$/i, '')

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename,
        title: cleanTitle || 'Untitled',
        uploadedAt: blob.uploadedAt,
        size: blob.size,
        fileType,
      }
    })

    return NextResponse.json({ presentations })
  } catch (error) {
    console.error('Error listing presentations:', error)
    return NextResponse.json({ error: 'Failed to list presentations' }, { status: 500 })
  }
}
