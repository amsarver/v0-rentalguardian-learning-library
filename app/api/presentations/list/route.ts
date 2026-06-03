import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'presentations/',
    })

    const presentations = blobs.map((blob) => ({
      pathname: blob.pathname,
      filename: blob.pathname.split('/').pop() || 'unknown',
      title: blob.pathname.split('/').pop()?.replace(/^\d+-/, '').replace('.pdf', '') || 'Untitled',
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }))

    return NextResponse.json({ presentations })
  } catch (error) {
    console.error('Error listing presentations:', error)
    return NextResponse.json({ error: 'Failed to list presentations' }, { status: 500 })
  }
}
