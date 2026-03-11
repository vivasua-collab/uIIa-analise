import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { companies: true }
        },
        companies: {
          where: { status: 'leader' },
          select: { id: true }
        }
      },
      orderBy: { title: 'asc' }
    })

    const result = categories.map(cat => ({
      id: cat.id,
      key: cat.key,
      title: cat.title,
      description: cat.description,
      marketSize: cat.marketSize,
      growth: cat.growth,
      iconName: cat.iconName,
      companiesCount: cat._count.companies,
      leadersCount: cat.companies.length
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
