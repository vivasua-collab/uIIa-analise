import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/comments?companyId=xxx - получить комментарии компании
// Комментарии объединяются по имени компании (одна компания в разных категориях)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    // Получаем компанию, чтобы узнать её имя
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { name: true }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Находим все ID компаний с таким же названием
    const sameCompanies = await db.company.findMany({
      where: { name: company.name },
      select: { id: true }
    })
    
    const companyIds = sameCompanies.map(c => c.id)

    // Получаем комментарии для всех компаний с таким названием
    const comments = await db.comment.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments - создать комментарий
// Комментарий создаётся для ВСЕХ компаний с таким же названием
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Получаем компанию, чтобы узнать её имя
    const company = await db.company.findUnique({
      where: { id: data.companyId },
      select: { name: true }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Находим все ID компаний с таким же названием
    const sameCompanies = await db.company.findMany({
      where: { name: company.name },
      select: { id: true }
    })
    
    const companyIds = sameCompanies.map(c => c.id)

    // Создаём комментарий для каждой компании с таким названием
    const comments = await Promise.all(
      companyIds.map(id => 
        db.comment.create({
          data: {
            text: data.text,
            author: data.author || null,
            companyId: id,
          }
        })
      )
    )

    // Возвращаем первый созданный комментарий (они все одинаковые)
    return NextResponse.json(comments[0], { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
