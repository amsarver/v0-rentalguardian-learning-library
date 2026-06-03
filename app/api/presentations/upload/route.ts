import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { type NextRequest, NextResponse } from 'next/server'

// This route handles the client upload token generation
// The actual file upload happens directly from the browser to Blob storage
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file type from pathname
        const fileName = pathname.toLowerCase()
        const isValidFile = 
          fileName.endsWith('.ppt') || 
          fileName.endsWith('.pptx') || 
          fileName.endsWith('.pdf')

        if (!isValidFile) {
          throw new Error('Only PowerPoint (.ppt, .pptx) and PDF files are allowed')
        }

        return {
          allowedContentTypes: [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/pdf',
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
