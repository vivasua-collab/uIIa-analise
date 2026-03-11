// Импорт компаний из JSON-файла в базу данных
// Запуск: bun run db:import
// Источник: prisma/companies-to-add.json

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CompanyInput {
  name: string
  inn?: string | null
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string | null
  alsoIn?: string[] | null
  categoryKey: string
  isPartner?: boolean
}

interface ImportData {
  companies: CompanyInput[]
}

async function main() {
  console.log('📥 Импорт компаний в базу данных...\n')

  // Читаем файл с данными
  const filePath = path.join(__dirname, 'companies-to-add.json')
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ Файл prisma/companies-to-add.json не найден!')
    console.log('\n💡 Создайте файл с данными компаний:')
    console.log('   1. Используйте промпт из PROMPT_RESEARCH.md')
    console.log('   2. Получите JSON от нейросети')
    console.log('   3. Сохраните в prisma/companies-to-add.json')
    process.exit(1)
  }

  let data: ImportData
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    // Удаляем комментарии (строки с _comment, _instructions и т.д.)
    const cleanContent = fileContent.replace(/"_[^"]+"\s*:\s*[^,}]+,?\s*/g, '')
    data = JSON.parse(cleanContent)
  } catch (e) {
    console.error('❌ Ошибка парсинга JSON:', e)
    process.exit(1)
  }

  if (!data.companies || data.companies.length === 0) {
    console.log('⚠️  Массив companies пуст. Нечего импортировать.')
    process.exit(0)
  }

  console.log(`📋 Найдено компаний для импорта: ${data.companies.length}\n`)

  // Получаем категории
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map(c => [c.key, c]))

  // Получаем существующие компании (для проверки дубликатов)
  const existingCompanies = await prisma.company.findMany({
    select: { name: true, inn: true }
  })
  const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase()))
  const existingInns = new Set(existingCompanies.map(c => c.inn).filter(Boolean))

  let added = 0
  let skipped = 0
  let errors = 0

  for (const company of data.companies) {
    // Проверка категории
    const category = categoryMap.get(company.categoryKey)
    if (!category) {
      console.log(`❌ ${company.name}: неизвестная категория "${company.categoryKey}"`)
      errors++
      continue
    }

    // Проверка дубликатов
    const normalizedName = company.name.toLowerCase()
    if (existingNames.has(normalizedName)) {
      console.log(`⏭️  ${company.name}: уже существует (по названию)`)
      skipped++
      continue
    }

    if (company.inn && existingInns.has(company.inn)) {
      console.log(`⏭️  ${company.name}: уже существует (по ИНН ${company.inn})`)
      skipped++
      continue
    }

    // Создание компании
    try {
      await prisma.company.create({
        data: {
          name: company.name,
          inn: company.inn || `no-inn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: company.status,
          revenue: company.revenue || null,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          isCustom: true,
          categoryId: category.id,
        }
      })
      
      console.log(`✅ ${company.name} → ${category.title} (${company.status})`)
      added++
      
      // Добавляем в проверки
      existingNames.add(normalizedName)
      if (company.inn) existingInns.add(company.inn)
      
    } catch (e: any) {
      console.log(`❌ ${company.name}: ошибка создания - ${e.message}`)
      errors++
    }
  }

  // Итоговая статистика
  console.log('\n' + '='.repeat(50))
  console.log('📊 Результаты импорта:')
  console.log(`   ✅ Добавлено: ${added}`)
  console.log(`   ⏭️  Пропущено (дубликаты): ${skipped}`)
  console.log(`   ❌ Ошибок: ${errors}`)
  console.log('='.repeat(50))

  // Подсказки
  if (added > 0) {
    console.log('\n💡 Следующие шаги:')
    console.log('   1. Проверьте новые компании в интерфейсе')
    console.log('   2. Экспортируйте в seed: bun run db:export')
    console.log('   3. Отправьте на GitHub: git add . && git commit && git push')
  }

  // Очищаем файл после успешного импорта
  if (added > 0 && errors === 0) {
    const templatePath = path.join(__dirname, 'companies-to-add-template.json')
    const template = {
      "_comment": "Шаблон для добавления новых компаний. Заполните поля и запустите: bun run db:import",
      "companies": []
    }
    fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8')
    console.log('\n🧹 Файл companies-to-add.json очищен')
  }
}

main()
  .catch((e) => {
    console.error('❌ Критическая ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
