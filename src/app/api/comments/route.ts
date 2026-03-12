import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Функция для проверки валидности ИНН (только цифры)
function isValidInn(inn: string | null | undefined): inn is string {
  if (!inn) return false
  return /^\d+$/.test(inn)
}

// GET /api/comments?companyId=xxx - получить комментарии компании
// Комментарии объединяются: сначала по ИНН (если валиден), потом по имени
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
      console.log(`[Comments API] Найдено ${companyIds.length} компаний по ИНН: ${company.inn}`)
    } else {
      // ИНН нет или невалиден - связываем по имени
      const sameNameCompanies = await db.company.findMany({
        where: { name: company.name },
        select: { id: true }
      })
      companyIds = sameNameCompanies.map(c => c.id)
      console.log(`[Comments API] Найдено ${companyIds.length} компаний по имени: ${company.name}`)
    }

    // Получаем комментарии для всех найденных компаний
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
// Комментарий создаётся для ВСЕХ компаний с таким же ИНН (приоритет) или именем
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Получаем компанию, чтобы узнать её имя и ИНН
    const company = await db.company.findUnique({
      where: { id: data.companyId },
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
      console.log(`[Comments API] Создание комментария для ${companyIds.length} компаний по ИНН: ${company.inn}`)
    } else {
      // ИНН нет или невалиден - связываем по имени
      const sameNameCompanies = await db.company.findMany({
        where: { name: company.name },
        select: { id: true }
      })
      companyIds = sameNameCompanies.map(c => c.id)
      console.log(`[Comments API] Создание комментария для ${companyIds.length} компаний по имени: ${company.name}`)
    }

    // Создаём комментарий для каждой найденной компании
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
