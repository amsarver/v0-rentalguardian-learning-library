import { del, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    // Find the blob with matching pathname
    const { blobs } = await list({ prefix: 'presentations/' })
    const blob = blobs.find(b => b.pathname === pathname)

    if (!blob) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete the blob
    await del(blob.url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
