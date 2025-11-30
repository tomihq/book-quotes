"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Share2, BookOpen } from "lucide-react"

interface Quote {
  id: string
  text: string
  author: string
  book: string
  page: number | null
}

export interface QuoteDisplayRef {
  refresh: () => void
}

export const QuoteDisplay = forwardRef<QuoteDisplayRef>((props, ref) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRandomQuote = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/quotes', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote')
      }
      
      const quote = await response.json()
      setCurrentQuote(quote)
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomQuote()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: fetchRandomQuote,
  }))

  const handleShare = () => {
    if (!currentQuote) return

    const pageText = currentQuote.page ? ` (p. ${currentQuote.page})` : ''
    const tweetText = `"${currentQuote.text}"\n\n— ${currentQuote.author}, ${currentQuote.book}${pageText}`

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

    window.open(tweetUrl, "_blank", "width=550,height=420")
  }

  if (isLoading && !currentQuote) {
    return (
      <Card className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Cargando quote...</p>
        </div>
      </Card>
    )
  }

  if (!currentQuote) {
    return (
      <Card className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No hay quotes disponibles</p>
          <Button onClick={fetchRandomQuote} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-2 p-8 md:p-12">
        <div className="space-y-8">
          <blockquote className="space-y-4">
            <p className="text-pretty font-serif text-2xl leading-relaxed text-foreground md:text-3xl md:leading-relaxed">
              "{currentQuote.text}"
            </p>
          </blockquote>
          <div className="flex items-start gap-3 border-t pt-6">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{currentQuote.author}</p>
              <p className="text-sm text-muted-foreground">
                {currentQuote.book}
                {currentQuote.page && `, página ${currentQuote.page}`}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={fetchRandomQuote} disabled={isLoading} className="flex-1" size="lg">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Nueva Quote
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent" size="lg">
          <Share2 className="mr-2 h-4 w-4" />
          Compartir en Twitter
        </Button>
      </div>
    </div>
  )
})

QuoteDisplay.displayName = "QuoteDisplay"

