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
        { description: { contains: search, mode: 'insensitive' } },
        { inn: { contains: search, mode: 'insensitive' } }
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
        { status: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(companies)
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
        features: data.features || [],
        status: data.status || 'active',
        revenue: data.revenue || null,
        alsoIn: data.alsoIn || [],
        categoryId: data.categoryId
      },
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
        }
      }
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}
