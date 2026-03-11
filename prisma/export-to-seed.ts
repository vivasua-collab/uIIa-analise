// Экспорт текущих данных из БД в seed-файл
// Запуск: bun run prisma/export-to-seed.ts
// Использовать перед git push, чтобы сохранить добавленные компании

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('📤 Экспорт данных из БД в seed-файл...\n')

  // Получаем все данные
  const categories = await prisma.category.findMany({
    include: {
      companies: true,
    },
    orderBy: { key: 'asc' },
  })

  // Формируем данные для seed
  const categoriesData = categories.map(cat => ({
    key: cat.key,
    title: cat.title,
    description: cat.description,
    marketSize: cat.marketSize,
    growth: cat.growth,
    iconName: cat.iconName,
  }))

  // Группируем компании по категориям
  const companiesByCategory: Record<string, { leaders: any[]; others: any[] }> = {}
  
  for (const cat of categories) {
    const leaders = cat.companies
      .filter(c => c.status === 'leader')
      .map(c => ({
        name: c.name,
        inn: c.inn || undefined,
        url: c.url,
        description: c.description,
        features: JSON.parse(c.features),
        status: 'leader' as const,
        revenue: c.revenue || undefined,
        alsoIn: c.alsoIn ? JSON.parse(c.alsoIn) : undefined,
        isPartner: c.isPartner || undefined,
      }))
    
    const others = cat.companies
      .filter(c => c.status === 'active')
      .map(c => ({
        name: c.name,
        inn: c.inn || undefined,
        url: c.url,
        description: c.description,
        features: JSON.parse(c.features),
        status: 'active' as const,
        revenue: c.revenue || undefined,
        alsoIn: c.alsoIn ? JSON.parse(c.alsoIn) : undefined,
        isPartner: c.isPartner || undefined,
      }))
    
    companiesByCategory[cat.key] = { leaders, others }
  }

  // Генерируем содержимое seed-файла
  const seedContent = `// Seed-скрипт для заполнения базы данных компаниями
// Автоматически сгенерировано: ${new Date().toISOString()}
// Запуск: bun run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Данные категорий
const categories = ${JSON.stringify(categoriesData, null, 2)}

// Данные компаний по категориям
const companiesByCategory: Record<string, Array<{
  name: string
  inn?: string
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string
  alsoIn?: string[]
  isPartner?: boolean
}>> = ${JSON.stringify(companiesByCategory, null, 2)
    .replace(/"status": "leader"/g, "status: 'leader' as const")
    .replace(/"status": "active"/g, "status: 'active' as const")}

async function main() {
  console.log('🌱 Начало заполнения базы данных...')
  console.log('📅 Дата: ${new Date().toISOString()}')

  // Создаём категории
  console.log('\\n📁 Создание категорий...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: cat,
      create: cat,
    })
    console.log(\`  ✓ \${cat.title}\`)
  }

  // Создаём компании
  console.log('\\n🏢 Создание компаний...')
  let totalCompanies = 0

  for (const [catKey, data] of Object.entries(companiesByCategory)) {
    const category = await prisma.category.findUnique({ where: { key: catKey } })
    if (!category) continue

    // Лидеры
    for (const company of data.leaders || []) {
      await prisma.company.upsert({
        where: {
          inn: company.inn || \`no-inn-\${catKey}-\${company.name}\`,
        },
        update: {
          name: company.name,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'leader',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
        create: {
          name: company.name,
          inn: company.inn || \`no-inn-\${catKey}-\${company.name}\`,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'leader',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
      })
      totalCompanies++
    }

    // Остальные
    for (const company of data.others || []) {
      await prisma.company.upsert({
        where: {
          inn: company.inn || \`no-inn-\${catKey}-\${company.name}\`,
        },
        update: {
          name: company.name,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'active',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
        create: {
          name: company.name,
          inn: company.inn || \`no-inn-\${catKey}-\${company.name}\`,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'active',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
      })
      totalCompanies++
    }

    console.log(\`  ✓ \${category.title}: \${(data.leaders?.length || 0) + (data.others?.length || 0)} компаний\`)
  }

  console.log(\`\\n✅ Готово! Всего создано \${totalCompanies} компаний\`)

  // Статистика
  const stats = await prisma.category.findMany({
    include: {
      _count: { select: { companies: true } },
    },
  })

  console.log('\\n📊 Статистика:')
  for (const cat of stats) {
    const leaders = await prisma.company.count({
      where: { categoryId: cat.id, status: 'leader' },
    })
    console.log(\`  \${cat.title}: \${cat._count.companies} компаний (\${leaders} лидеров)\`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`

  // Записываем файл
  const seedPath = path.join(__dirname, 'seed.ts')
  fs.writeFileSync(seedPath, seedContent, 'utf-8')

  // Выводим статистику
  const totalCompanies = categories.reduce((sum, cat) => sum + cat.companies.length, 0)
  const totalLeaders = categories.reduce((sum, cat) => 
    sum + cat.companies.filter(c => c.status === 'leader').length, 0)
  const totalPartners = categories.reduce((sum, cat) => 
    sum + cat.companies.filter(c => c.isPartner).length, 0)

  console.log('✅ Seed-файл успешно обновлён!')
  console.log(`📄 Файл: ${seedPath}\n`)
  console.log('📊 Статистика экспорта:')
  console.log(`   Категорий: ${categories.length}`)
  console.log(`   Компаний: ${totalCompanies}`)
  console.log(`   Лидеров: ${totalLeaders}`)
  console.log(`   Партнёров: ${totalPartners}\n`)
  console.log('💡 Теперь можно сделать git add и git push')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
