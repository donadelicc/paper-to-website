export interface ParsedPaper {
  title: string
  abstract: string
  sections: Section[]
  references: string[]
  metadata: {
    fileName: string
    fileSize: number
    fileType: string
    parsedAt: string
  }
}

export interface Section {
  heading: string
  content: string
}
