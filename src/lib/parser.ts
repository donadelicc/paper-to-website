import { ParsedPaper, Section } from '@/types/paper'

export async function parsePDF(buffer: Buffer, fileName: string, fileSize: number): Promise<ParsedPaper> {
  const pdf = (await import('pdf-parse')).default
  const data = await pdf(buffer)
  const text = data.text
  
  return extractStructure(text, fileName, fileSize, 'application/pdf')
}

export async function parseDOCX(buffer: Buffer, fileName: string, fileSize: number): Promise<ParsedPaper> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  const text = result.value
  
  return extractStructure(text, fileName, fileSize, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
}

export async function parseTXT(buffer: Buffer, fileName: string, fileSize: number): Promise<ParsedPaper> {
  const text = buffer.toString('utf-8')
  
  return extractStructure(text, fileName, fileSize, 'text/plain')
}

function extractStructure(text: string, fileName: string, fileSize: number, fileType: string): ParsedPaper {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const title = lines[0] || 'Untitled Paper'
  
  let abstract = ''
  const abstractIndex = lines.findIndex(line => 
    line.toLowerCase().includes('abstract')
  )
  if (abstractIndex !== -1 && abstractIndex + 1 < lines.length) {
    const abstractLines = []
    for (let i = abstractIndex + 1; i < lines.length; i++) {
      const line = lines[i]
      if (
        line.toUpperCase() === line ||
        /^\d+\.?\s+[A-Z]/.test(line) ||
        /^(introduction|background|methods|results|conclusion|references)/i.test(line)
      ) {
        break
      }
      abstractLines.push(line)
    }
    abstract = abstractLines.join(' ')
  }
  
  const sections: Section[] = []
  let currentSection: Section | null = null
  
  for (const line of lines) {
    const isHeading = 
      line.toUpperCase() === line && line.length < 100 ||
      /^\d+\.?\s+[A-Z]/.test(line) ||
      /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line)
    
    if (isHeading && !line.toLowerCase().includes('abstract')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        heading: line,
        content: ''
      }
    } else if (currentSection) {
      currentSection.content += (currentSection.content ? ' ' : '') + line
    }
  }
  
  if (currentSection) {
    sections.push(currentSection)
  }
  
  const references: string[] = []
  const referencesIndex = lines.findIndex(line => 
    /^references?$/i.test(line.trim())
  )
  if (referencesIndex !== -1) {
    for (let i = referencesIndex + 1; i < lines.length; i++) {
      const line = lines[i]
      if (/^[\[\(]?\d+[\]\)]?\.?\s/.test(line) || line.length > 20) {
        references.push(line)
      }
    }
  }
  
  return {
    title,
    abstract: abstract || 'No abstract found',
    sections: sections.length > 0 ? sections : [{
      heading: 'Content',
      content: text.slice(0, 1000) + (text.length > 1000 ? '...' : '')
    }],
    references: references.length > 0 ? references : ['No references found'],
    metadata: {
      fileName,
      fileSize,
      fileType,
      parsedAt: new Date().toISOString()
    }
  }
}
