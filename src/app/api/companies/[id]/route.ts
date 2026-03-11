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

    return NextResponse.json(company)
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

    const company = await db.company.update({
      where: { id },
      data: {
        name: data.name,
        inn: data.inn || null,
        url: data.url,
        description: data.description,
        features: JSON.stringify(data.features || []),
        status: data.status || 'active',
        revenue: data.revenue || null,
        alsoIn: JSON.stringify(data.alsoIn || []),
        categoryId: data.categoryId,
        isPartner: data.isPartner || false,
      },
      include: {
        category: {
          select: { id: true, key: true, title: true, iconName: true }
        }
      }
    })

    return NextResponse.json(company)
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
