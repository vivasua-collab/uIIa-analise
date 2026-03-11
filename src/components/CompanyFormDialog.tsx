'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Plus } from 'lucide-react'

// Типы
interface Category {
  id: string
  key: string
  title: string
}

interface Company {
  id: string
  name: string
  inn?: string
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string
  alsoIn?: string[]
  categoryId: string
}

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company | null
  categories: Category[]
  onSuccess: () => void
}

// Направления для alsoIn
const directions = ['LLM', 'Аудио', 'Видео', 'DL', 'Генерация']

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  categories,
  onSuccess,
}: CompanyFormDialogProps) {
  const isEdit = !!company
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Форма
  const [name, setName] = useState('')
  const [inn, setInn] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'leader' | 'active'>('active')
  const [revenue, setRevenue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [alsoIn, setAlsoIn] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')

  // Заполняем форму при редактировании
  useEffect(() => {
    if (company) {
      setName(company.name)
      setInn(company.inn || '')
      setUrl(company.url)
      setDescription(company.description)
      setStatus(company.status)
      setRevenue(company.revenue || '')
      setCategoryId(company.categoryId)
      setFeatures(company.features || [])
      setAlsoIn(company.alsoIn || [])
    } else {
      // Сброс формы для новой компании
      setName('')
      setInn('')
      setUrl('')
      setDescription('')
      setStatus('active')
      setRevenue('')
      setCategoryId(categories[0]?.id || '')
      setFeatures([])
      setAlsoIn([])
    }
    setError(null)
  }, [company, categories, open])

  // Добавление feature
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  // Удаление feature
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // Переключение направления
  const toggleDirection = (dir: string) => {
    if (alsoIn.includes(dir)) {
      setAlsoIn(alsoIn.filter(d => d !== dir))
    } else {
      setAlsoIn([...alsoIn, dir])
    }
  }

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Валидация
    if (!name.trim()) {
      setError('Название компании обязательно')
      return
    }
    if (!url.trim()) {
      setError('URL компании обязателен')
      return
    }
    if (!description.trim()) {
      setError('Описание компании обязательно')
      return
    }
    if (!categoryId) {
      setError('Выберите категорию')
      return
    }

    setLoading(true)

    try {
      const body = {
        name: name.trim(),
        inn: inn.trim() || null,
        url: url.trim(),
        description: description.trim(),
        status,
        revenue: revenue.trim() || null,
        categoryId,
        features,
        alsoIn,
      }

      const response = await fetch(
        isEdit ? `/api/companies/${company.id}` : '/api/companies',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка сохранения')
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактировать компанию' : 'Добавить компанию'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Измените данные компании и нажмите "Сохранить"'
              : 'Заполните данные новой компании'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="name">Название компании *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название компании"
            />
          </div>

          {/* ИНН и Выручка */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inn">ИНН</Label>
              <Input
                id="inn"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Выручка</Label>
              <Input
                id="revenue"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="1 млрд ₽"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL сайта *</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://company.ru"
            />
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание деятельности компании..."
              rows={3}
            />
          </div>

          {/* Категория и Статус */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Категория *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as 'leader' | 'active')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Лидер рынка</SelectItem>
                  <SelectItem value="active">Активный игрок</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Особенности/Технологии */}
          <div className="space-y-2">
            <Label>Особенности / Технологии</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Добавить особенность..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Также специализируется на */}
          <div className="space-y-2">
            <Label>Также специализируется на</Label>
            <div className="flex flex-wrap gap-2">
              {directions.map((dir) => (
                <Badge
                  key={dir}
                  variant={alsoIn.includes(dir) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleDirection(dir)}
                >
                  {dir}
                </Badge>
              ))}
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
