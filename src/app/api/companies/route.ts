import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    })

    // Парсим JSON поля из строки в массив
    const parsedCompanies = companies.map(c => ({
      ...c,
      features: typeof c.features === 'string' ? JSON.parse(c.features) : (c.features || []),
      alsoIn: c.alsoIn ? (typeof c.alsoIn === 'string' ? JSON.parse(c.alsoIn) : c.alsoIn) : []
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

    const company = await db.company.create({
      data: {
        name: data.name,
        inn: data.inn || null,
        url: data.url,
        description: data.description,
        features: JSON.stringify(data.features || []),
        status: data.status || 'active',
        revenue: data.revenue || null,
        alsoIn: data.alsoIn ? JSON.stringify(data.alsoIn) : null,
        categoryId: data.categoryId,
        isPartner: data.isPartner || false,
      },
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
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
