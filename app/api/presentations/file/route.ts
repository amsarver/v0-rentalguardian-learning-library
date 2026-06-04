import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')
    console.log('[v0] File request for pathname:', pathname)

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    // Use get() to fetch private blob content
    const result = await get(pathname, { access: 'private' })

    if (!result || result.statusCode !== 200) {
      console.log('[v0] Blob not found or error:', result?.statusCode)
      return new NextResponse('Not found', { status: 404 })
    }

    const filename = pathname.split('/').pop() || 'download'
    
    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error('[v0] Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
