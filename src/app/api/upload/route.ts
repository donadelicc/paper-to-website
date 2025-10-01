import { NextRequest, NextResponse } from 'next/server'
import { validateFile, getFileExtension } from '@/lib/validation'
import { parsePDF, parseDOCX, parseTXT } from '@/lib/parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extension = getFileExtension(file.name)
    let result

    try {
      if (extension === '.pdf') {
        result = await parsePDF(buffer, file.name, file.size)
      } else if (extension === '.docx' || extension === '.doc') {
        result = await parseDOCX(buffer, file.name, file.size)
      } else if (extension === '.txt') {
        result = await parseTXT(buffer, file.name, file.size)
      } else {
        throw new Error('Unsupported file type')
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse file. The file may be corrupted or in an unsupported format.' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during upload' },
      { status: 500 }
    )
  }
}
