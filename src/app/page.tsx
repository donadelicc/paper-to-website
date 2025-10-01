"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PaperResult } from "@/components/paper-result"
import { ParsedPaper } from "@/types/paper"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ParsedPaper | null>(null)

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
    setError(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    setProgress(10)
    setError(null)
    setResult(null)

    try {
      const file = selectedFiles[0]
      const formData = new FormData()
      formData.append('file', file)

      setProgress(30)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setProgress(70)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Paper to Website</h1>
          <p className="text-muted-foreground">
            Turn your research paper into a website effortlessly.
          </p>
        </div>

        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Research Paper</CardTitle>
              <CardDescription>
                Upload your paper and we&apos;ll transform it into an interactive website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload onFileSelect={handleFileSelect} />
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleUpload} 
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Processing...' : 'Upload and Convert'}
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Processing your paper...</p>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Your paper has been processed successfully.</AlertDescription>
            </Alert>
            
            <PaperResult paper={result} />
            
            <Button 
              onClick={() => {
                setResult(null)
                setSelectedFiles([])
              }}
              variant="outline"
              className="w-full"
            >
              Upload Another Paper
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
