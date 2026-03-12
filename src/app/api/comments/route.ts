import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Функция для проверки валидности ИНН (только цифры)
function isValidInn(inn: string | null | undefined): inn is string {
  if (!inn) return false
  return /^\d+$/.test(inn)
}

// GET /api/comments?companyId=xxx - получить комментарии компании
// Комментарии объединяются: сначала по ИНН (если валиден), потом по имени
// Дедуплицируются по тексту (для случая когда одна компания в разных категориях)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    // Получаем компанию, чтобы узнать её имя и ИНН
    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { name: true, inn: true }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    let companyIds: string[] = []

    // Приоритет связывания: сначала по ИНН, потом по имени
    if (isValidInn(company.inn)) {
      // Связываем по ИНН
      const sameInnCompanies = await db.company.findMany({
        where: { inn: company.inn },
        select: { id: true }
      })
      companyIds = sameInnCompanies.map(c => c.id)
    } else {
      // ИНН нет или невалиден - связываем по имени
      const sameNameCompanies = await db.company.findMany({
        where: { name: company.name },
        select: { id: true }
      })
      companyIds = sameNameCompanies.map(c => c.id)
    }

    // Получаем комментарии для всех найденных компаний
    const comments = await db.comment.findMany({
      where: { companyId: { in: companyIds } },
      orderBy: { createdAt: 'desc' }
    })

    // Дедупликация по тексту (для компаний без ИНН, которые дублируются в разных категориях)
    const seenTexts = new Set<string>()
    const uniqueComments = comments.filter(comment => {
      const key = comment.text.trim().toLowerCase()
      if (seenTexts.has(key)) {
        return false
      }
      seenTexts.add(key)
      return true
    })

    return NextResponse.json(uniqueComments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/comments - создать комментарий
// Комментарий создаётся ТОЛЬКО для текущей компании
// Связь с другими компаниями осуществляется через GET (по ИНН или имени)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.companyId || !data.text) {
      return NextResponse.json({ error: 'companyId and text are required' }, { status: 400 })
    }

    // Проверяем, существует ли компания
    const company = await db.company.findUnique({
      where: { id: data.companyId },
      select: { id: true, name: true, inn: true }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Создаём комментарий только для текущей компании
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
