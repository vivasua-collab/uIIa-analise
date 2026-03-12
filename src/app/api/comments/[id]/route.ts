import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// DELETE /api/comments/[id] - удалить комментарий и его дубликаты
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Получаем комментарий чтобы узнать его текст
    const comment = await db.comment.findUnique({
      where: { id },
      select: { text: true, createdAt: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Удаляем все комментарии с таким же текстом, созданные в то же время (±1 секунда)
    // Это удаляет дубликаты, созданные для компаний в разных категориях
    const timeWindow = new Date(comment.createdAt.getTime() - 1000)
    const timeWindowEnd = new Date(comment.createdAt.getTime() + 1000)

    const deleteResult = await db.comment.deleteMany({
      where: {
        text: comment.text,
        createdAt: {
          gte: timeWindow,
          lte: timeWindowEnd
        }
      }
    })

    console.log(`[Comments API] Удалено ${deleteResult.count} комментариев`)

    return NextResponse.json({ success: true, deleted: deleteResult.count })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
