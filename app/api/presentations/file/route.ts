import { type NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')
    console.log('[v0] File request for pathname:', pathname)

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    // List blobs to find the one with matching pathname
    const { blobs } = await list({ prefix: pathname.split('/')[0] })
    console.log('[v0] Found blobs:', blobs.map(b => b.pathname))
    
    const blob = blobs.find(b => b.pathname === pathname)
    
    if (!blob) {
      console.log('[v0] Blob not found for pathname:', pathname)
      return new NextResponse('Not found', { status: 404 })
    }

    console.log('[v0] Found blob URL:', blob.url)

    // Fetch the file content from the blob URL
    const fileResponse = await fetch(blob.url)
    
    if (!fileResponse.ok) {
      console.log('[v0] Failed to fetch blob:', fileResponse.status, fileResponse.statusText)
      return new NextResponse('Failed to fetch file', { status: 500 })
    }

    const contentType = blob.contentType || 'application/octet-stream'
    const filename = blob.pathname.split('/').pop() || 'download'

    return new NextResponse(fileResponse.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[v0] Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
