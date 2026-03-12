import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Функция для проверки валидности ИНН (только цифры)
function isValidInn(inn: string | null | undefined): inn is string {
  if (!inn) return false
  return /^\d+$/.test(inn)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (status && (status === 'leader' || status === 'active')) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const companies = await db.company.findMany({
      where,
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
        },
        parentCompany: {
          select: { id: true, name: true, inn: true }
        },
        subsidiaries: {
          select: { id: true, name: true, inn: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    })

    // Получаем все компании для группировки комментариев
    const allCompanies = await db.company.findMany({
      select: { id: true, name: true, inn: true }
    })
    
    // Группируем компании по ИНН (приоритет) и по имени
    const innToIds: Map<string, string[]> = new Map()
    const nameToIds: Map<string, string[]> = new Map()
    
    for (const c of allCompanies) {
      // Группируем по валидному ИНН
      if (isValidInn(c.inn)) {
        if (!innToIds.has(c.inn)) {
          innToIds.set(c.inn, [])
        }
        innToIds.get(c.inn)!.push(c.id)
      }
      // Группируем по имени
      if (!nameToIds.has(c.name)) {
        nameToIds.set(c.name, [])
      }
      nameToIds.get(c.name)!.push(c.id)
    }

    // Функция для получения ID связанных компаний
    const getLinkedIds = (companyId: string, name: string, inn: string | null): string[] => {
      if (isValidInn(inn)) {
        return innToIds.get(inn) || [companyId]
      }
      return nameToIds.get(name) || [companyId]
    }

    // Получаем количество комментариев для каждой группы
    const commentCounts: Map<string, number> = new Map()
    
    for (const c of allCompanies) {
      const key = c.id
      if (commentCounts.has(key)) continue
      
      const linkedIds = getLinkedIds(c.id, c.name, c.inn)
      const count = await db.comment.count({
        where: { companyId: { in: linkedIds } }
      })
      
      // Сохраняем счётчик для всех связанных компаний
      for (const id of linkedIds) {
        commentCounts.set(id, count)
      }
    }

    // Парсим JSON поля и обновляем счётчик комментариев
    const parsedCompanies = companies.map(c => ({
      ...c,
      features: typeof c.features === 'string' ? JSON.parse(c.features) : (c.features || []),
      alsoIn: c.alsoIn ? (typeof c.alsoIn === 'string' ? JSON.parse(c.alsoIn) : c.alsoIn) : [],
      _count: {
        comments: commentCounts.get(c.id) || 0
      }
    }))

    return NextResponse.json(parsedCompanies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Проверяем валидность ИНН
    const validInn = isValidInn(data.inn) ? data.inn : null

    const company = await db.company.create({
      data: {
        name: data.name,
        inn: validInn,
        url: data.url,
        description: data.description,
        features: JSON.stringify(data.features || []),
        status: data.status || 'active',
        revenue: data.revenue || null,
        alsoIn: data.alsoIn ? JSON.stringify(data.alsoIn) : null,
        categoryId: data.categoryId,
        isPartner: data.isPartner || false,
        parentCompanyId: data.parentCompanyId || null,
      },
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
        },
        parentCompany: {
          select: { id: true, name: true, inn: true }
        }
      }
    })

    // Парсим для ответа
    return NextResponse.json({
      ...company,
      features: typeof company.features === 'string' ? JSON.parse(company.features) : company.features,
      alsoIn: company.alsoIn ? (typeof company.alsoIn === 'string' ? JSON.parse(company.alsoIn) : company.alsoIn) : []
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}
