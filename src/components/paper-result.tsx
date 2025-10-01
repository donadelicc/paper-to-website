"use client"

import * as React from "react"
import { ParsedPaper } from "@/types/paper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PaperResultProps {
  paper: ParsedPaper
}

export function PaperResult({ paper }: PaperResultProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
          <CardDescription>
            {paper.metadata.fileName} • {(paper.metadata.fileSize / 1024).toFixed(1)} KB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Abstract</h3>
            <p className="text-sm text-muted-foreground">{paper.abstract}</p>
          </div>

          {paper.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold mb-2">{section.heading}</h3>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}

          {paper.references.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">References ({paper.references.length})</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                {paper.references.slice(0, 5).map((ref, index) => (
                  <li key={index}>• {ref}</li>
                ))}
                {paper.references.length > 5 && (
                  <li className="italic">... and {paper.references.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
