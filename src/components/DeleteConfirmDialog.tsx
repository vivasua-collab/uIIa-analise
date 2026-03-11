'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyName: string
  onConfirm: () => Promise<void>
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  companyName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить компанию?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить компанию <strong>{companyName}</strong>?
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
