import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const company = await db.company.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Парсим JSON поля
    return NextResponse.json({
      ...company,
      features: typeof company.features === 'string' ? JSON.parse(company.features) : company.features,
      alsoIn: company.alsoIn ? (typeof company.alsoIn === 'string' ? JSON.parse(company.alsoIn) : company.alsoIn) : []
    })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Очищаем ИНН - если "no-inn-*" или пустой, ставим null
    let inn = data.inn || null
    if (inn && (inn.startsWith('no-inn-') || inn.trim() === '')) {
      inn = null
    }

    const company = await db.company.update({
      where: { id },
      data: {
        name: data.name,
        inn: inn,
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
    })
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.company.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
  }
}
