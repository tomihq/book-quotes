"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateQuoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateQuoteModal({ open, onOpenChange, onSuccess }: CreateQuoteModalProps) {
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    book: "",
    page: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Obtener el token CSRF de la meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      
      const payload: Record<string, string | number> = {
        text: formData.text,
        author: formData.author,
        book: formData.book,
      }

      if (formData.page) {
        payload.page = parseInt(formData.page, 10)
      }

      const response = await fetch('/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al crear la quote' }))
        
        // Manejar errores de validación de Laravel
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat()
          throw new Error(errorMessages.join(', ') || 'Error de validación')
        }
        
        throw new Error(errorData.message || 'Error al crear la quote')
      }

      // Resetear form y cerrar modal
      setFormData({ text: "", author: "", book: "", page: "" })
      onOpenChange(false)
      
      // Llamar callback de éxito si existe (para refrescar la quote)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Crear Nueva Quote</DialogTitle>
          <DialogDescription>Agrega una nueva cita literaria a la colección</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="text">Texto de la quote *</Label>
              <Textarea
                id="text"
                placeholder="Escribe la cita aquí..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                required
                className="min-h-[100px] resize-none font-serif"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                placeholder="Ej: Gabriel García Márquez"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book">Libro *</Label>
              <Input
                id="book"
                placeholder="Ej: Cien años de soledad"
                value={formData.book}
                onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="page">Página (opcional)</Label>
              <Input
                id="page"
                type="number"
                placeholder="Ej: 142"
                value={formData.page}
                onChange={(e) => setFormData({ ...formData, page: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormData({ text: "", author: "", book: "", page: "" })
                setError(null)
                onOpenChange(false)
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Quote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

