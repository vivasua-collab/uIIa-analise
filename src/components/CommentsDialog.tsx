'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, Trash2, Loader2, User } from 'lucide-react'

interface Comment {
  id: string
  text: string
  author?: string | null
  companyId: string
  createdAt: string
  updatedAt: string
}

interface Company {
  id: string
  name: string
  url: string
}

interface CommentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

export function CommentsDialog({ open, onOpenChange, company }: CommentsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')

  // Загрузка комментариев при открытии диалога
  useEffect(() => {
    if (open && company) {
      loadComments()
    }
  }, [open, company])

  const loadComments = async () => {
    if (!company) return
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?companyId=${company.id}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!company || !newComment.trim()) return
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment.trim(),
          author: author.trim() || null,
          companyId: company.id
        })
      })
      
      if (response.ok) {
        const newCommentData = await response.json()
        setComments([newCommentData, ...comments])
        setNewComment('')
        setAuthor('')
      }
    } catch (error) {
      console.error('Ошибка создания комментария:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId))
      }
    } catch (error) {
      console.error('Ошибка удаления комментария:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Комментарии
          </DialogTitle>
          <DialogDescription>
            {company?.name || 'Компания'}
          </DialogDescription>
        </DialogHeader>

        {/* Форма добавления комментария */}
        <div className="space-y-3 py-4 border-b">
          <Input
            placeholder="Ваше имя (опционально)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Textarea
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm min-h-[80px] flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit()
                }
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Ctrl+Enter для отправки
            </span>
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Список комментариев */}
        <ScrollArea className="h-[300px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Нет комментариев. Будьте первым!
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {comments.map((comment) => (
                <div key={comment.id} className="group relative bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {comment.author ? (
                        <Badge variant="outline" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          {comment.author}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Аноним
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Ссылка на сайт компании */}
        {company?.url && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(company.url, '_blank')}
            >
              Перейти на сайт компании
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
