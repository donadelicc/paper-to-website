"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return
    console.log("Uploading files:", selectedFiles)
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
                <Button onClick={handleUpload} className="w-full">
                  Upload and Convert
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
