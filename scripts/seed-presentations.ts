import { put, list } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'

async function seedPresentations() {
  console.log('Checking for existing presentations...')
  
  try {
    const { blobs } = await list({ prefix: 'presentations/' })
    
    // Check if we already have the Smart.ly presentation
    const existingSmartly = blobs.find(b => b.pathname.includes('Smart.ly'))
    
    if (existingSmartly) {
      console.log('Presentations already seeded.')
      return
    }
    
    console.log('Seeding initial presentation...')
    
    // Read the local PDF file
    const pdfPath = join(process.cwd(), 'public', 'temp-presentation.pdf')
    const pdfBuffer = readFileSync(pdfPath)
    
    // Upload to Blob storage
    const blob = await put(
      'presentations/RentalGuardian-Smart.ly-and-mySedgwick-Branded.pdf',
      pdfBuffer,
      {
        access: 'private',
        contentType: 'application/pdf',
      }
    )
    
    console.log('Successfully uploaded:', blob.pathname)
  } catch (error) {
    console.error('Error seeding presentations:', error)
  }
}

seedPresentations()
