import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/comments?companyId=xxx - получить комментарии компании
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    const comments = await db.comment.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments - создать комментарий
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const comment = await db.comment.create({
      data: {
        text: data.text,
        author: data.author || null,
        companyId: data.companyId,
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
