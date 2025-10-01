"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps extends React.ComponentProps<"div"> {
  onFileSelect?: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

function FileUpload({
  className,
  onFileSelect,
  accept = ".pdf,.doc,.docx,.txt",
  multiple = false,
  ...props
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed border-border bg-background p-8 transition-colors cursor-pointer",
        isDragging && "border-primary bg-primary/5",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Drag and drop your research paper here
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse files
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Supports PDF, DOC, DOCX, TXT files
        </p>
      </div>
    </div>
  )
}

export { FileUpload }
