'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CompanyFormDialog } from '@/components/CompanyFormDialog'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  DollarSign,
  ExternalLink,
  Rocket,
  Target,
  BarChart3,
  Layers,
  AlertTriangle,
  PieChart,
  LayoutGrid,
  List,
  Shield,
  Server,
  Calculator,
  CheckCircle,
  XCircle,
  Minus,
  Search,
  X,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Settings,
  Check,
  ArrowUpDown
} from 'lucide-react'

// Текущий год
const CURRENT_YEAR = 2026

// Общий обзор рынка (источники: TAdviser, РБК, НИУ ВШЭ)
const marketOverview = {
  totalMarket: '433 млрд ₽',
  totalMarketNote: 'Big Data + ИИ (2024-2025)',
  directMarket: '117,7 млрд ₽',
  directMarketNote: 'Рынок ИИ напрямую (РБК)',
  investments: '305 млрд ₽',
  investmentsNote: 'Инвестиции в ИИ (TAdviser)',
  growth: '+38%',
  growthSource: 'РБК',
  companies: '150+',
  forecast2030: '11,6 трлн ₽',
  forecast2030Note: 'Вклад ИИ в ВВП РФ (НИУ ВШЭ)'
}

// Типизация компании
interface Company {
  id: string
  name: string
  inn?: string
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string
  alsoIn?: string[]
  categoryId: string
  isPartner?: boolean
  category?: {
    id: string
    key: string
    title: string
    iconName: string
  }
}

// Типизация категории
interface Category {
  id: string
  key: string
  title: string
  description: string
  marketSize: string
  growth: string
  iconName: string
  companiesCount: number
  leadersCount: number
}

// Типизация для techData
interface TechCategory {
  title: string
  description: string
  marketSize: string
  growth: string
  icon: React.ElementType
  leaders: Company[]
  others: Company[]
}

// Иконки по ключам категорий
const iconMap: Record<string, React.ElementType> = {
  MessageSquare: MessageSquare,
  Mic: Mic,
  Video: Video,
  Brain: Brain,
  Sparkles: Sparkles,
}

// Цвета для бейджей направлений
const directionColors: Record<string, string> = {
  'LLM': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Аудио': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Видео': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'DL': 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'Генерация': 'bg-pink-500/10 text-pink-600 border-pink-500/20'
}

// ============================================
// КОМПОНЕНТ: Карточка лидера (большая)
// ============================================
function LeaderCard({ 
  company, 
  isHighlighted,
  onEdit,
  onDelete 
}: { 
  company: Company
  isHighlighted?: boolean
  onEdit?: (company: Company) => void
  onDelete?: (company: Company) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 h-full flex flex-col
        ${isHighlighted ? 'ring-2 ring-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate">{company.name}</CardTitle>
            {company.inn && (
              <CardDescription className="text-xs text-muted-foreground mt-1">
                ИНН: {company.inn}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 whitespace-nowrap">
              Лидер
            </Badge>
            {company.revenue && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap max-w-full truncate">
                {company.revenue}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-shrink-0">
          {company.description}
        </p>
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {company.features.map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        {company.alsoIn && company.alsoIn.length > 0 && (
          <div className="pt-2 border-t flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Layers className="h-3 w-3" />
              <span>Также специализируется на:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {company.alsoIn.map((area, idx) => (
                <Badge key={idx} variant="outline" className={`text-xs ${directionColors[area] || ''}`}>
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto pt-3 flex gap-2">
          <Button 
            variant={isHovered ? "default" : "outline"}
            size="sm" 
            className="flex-1 transition-all"
            onClick={() => window.open(company.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Перейти на сайт
          </Button>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(company)}
              title="Редактировать"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(company)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              title="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// КОМПОНЕНТ: Мини-карточка
// ============================================
function MiniCard({ 
  company, 
  isHighlighted,
  onEdit,
  onDelete 
}: { 
  company: Company
  isHighlighted?: boolean
  onEdit?: (company: Company) => void
  onDelete?: (company: Company) => void
}) {
  return (
    <Card className={`group hover:shadow-md transition-all duration-200 hover:border-primary/30 h-full flex flex-col
      ${isHighlighted ? 'ring-2 ring-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30' : ''}`}>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{company.name}</h4>
            {company.revenue && (
              <p className="text-xs text-muted-foreground truncate">{company.revenue}</p>
            )}
          </div>
          {company.alsoIn && company.alsoIn.length > 0 && (
            <div className="flex gap-0.5 flex-shrink-0">
              {company.alsoIn.slice(0, 2).map((area, idx) => (
                <Badge key={idx} variant="outline" className={`text-[10px] px-1 whitespace-nowrap ${directionColors[area] || ''}`}>
                  {area}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
          {company.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {company.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px]">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1"
                onClick={() => onEdit(company)}
                title="Редактировать"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 text-destructive hover:text-destructive"
                onClick={() => onDelete(company)}
                title="Удалить"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => window.open(company.url, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// КОМПОНЕНТ: Секция категории (Вариант A)
// ============================================
function CategorySectionVariantA({ 
  title, description, marketSize, growth, leaders, others, icon: Icon,
  searchQuery = '', companyMatchesSearch = () => false,
  onEditCompany, onDeleteCompany
}: { 
  title: string
  description: string
  marketSize: string
  growth: string
  leaders: Company[]
  others: Company[]
  icon: React.ElementType
  searchQuery?: string
  companyMatchesSearch?: (company: Company, query: string) => boolean
  onEditCompany?: (company: Company) => void
  onDeleteCompany?: (company: Company) => void
}) {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Размер рынка</span>
            </div>
            <p className="text-xl font-bold mt-1">{marketSize}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Рост</span>
            </div>
            <p className="text-xl font-bold mt-1">{growth}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Target className="h-4 w-4" />
              <span>Лидеров</span>
            </div>
            <p className="text-xl font-bold mt-1 text-emerald-600">{leaders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Building2 className="h-4 w-4" />
              <span>Всего</span>
            </div>
            <p className="text-xl font-bold mt-1">{leaders.length + others.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Топ-6 лидеров */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Лидеры рынка
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaders.map((company) => (
            <LeaderCard 
              key={company.id} 
              company={company} 
              isHighlighted={companyMatchesSearch(company, searchQuery)}
              onEdit={onEditCompany}
              onDelete={onDeleteCompany}
            />
          ))}
        </div>
      </div>

      {/* Остальные игроки */}
      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Другие игроки ({others.length})
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {others.map((company) => (
              <MiniCard 
                key={company.id} 
                company={company} 
                isHighlighted={companyMatchesSearch(company, searchQuery)}
                onEdit={onEditCompany}
                onDelete={onDeleteCompany}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Секция категории (Вариант B - Компактный)
// ============================================
function CategorySectionVariantB({ 
  title, description, marketSize, growth, leaders, others, icon: Icon,
  searchQuery = '', companyMatchesSearch = () => false,
  onEditCompany, onDeleteCompany
}: { 
  title: string
  description: string
  marketSize: string
  growth: string
  leaders: Company[]
  others: Company[]
  icon: React.ElementType
  searchQuery?: string
  companyMatchesSearch?: (company: Company, query: string) => boolean
  onEditCompany?: (company: Company) => void
  onDeleteCompany?: (company: Company) => void
}) {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{marketSize}</Badge>
            <Badge variant="secondary">{growth}</Badge>
            <Badge variant="outline" className="text-emerald-600">{leaders.length} лидеров</Badge>
          </div>
        </div>
      </div>

      {/* Лидеры рынка - grid раскладка */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Лидеры рынка
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaders.map((company) => (
            <LeaderCard 
              key={company.id} 
              company={company} 
              isHighlighted={companyMatchesSearch(company, searchQuery)}
              onEdit={onEditCompany}
              onDelete={onDeleteCompany}
            />
          ))}
        </div>
      </div>

      {/* Остальные - таблица */}
      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <List className="h-5 w-5" />
            Другие игроки ({others.length})
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Компания</th>
                      <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Описание</th>
                      <th className="text-left p-3 text-sm font-medium hidden lg:table-cell">Технологии</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((company) => {
                      const isHighlighted = companyMatchesSearch(company, searchQuery)
                      return (
                        <tr key={company.id} className={`border-t hover:bg-muted/30 ${isHighlighted ? 'bg-orange-500/10 ring-1 ring-orange-500/50' : ''}`}>
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-sm">{company.name}</p>
                              {company.revenue && <p className="text-xs text-muted-foreground">{company.revenue}</p>}
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <p className="text-sm text-muted-foreground line-clamp-1">{company.description}</p>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <div className="flex gap-1 flex-wrap">
                              {company.features.slice(0, 2).map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {onEditCompany && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onEditCompany(company)}
                                  title="Редактировать"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {onDeleteCompany && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onDeleteCompany(company)}
                                  className="text-destructive hover:text-destructive"
                                  title="Удалить"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => window.open(company.url, '_blank')}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Блок рисков ИИ-пузыря
// ============================================
function BubbleRiskBlock() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Риски ИИ-пузыря</h2>
          <p className="text-muted-foreground mt-1">Параллели с пузырём доткомов (2000) и прогноз для рынка ИИ</p>
        </div>
      </div>

      {/* Индикаторы риска */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Индикаторы риска
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Спекулятивные инвестиции</span>
                <span className="text-red-500">🔴 Критический</span>
              </div>
              <Progress value={90} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Переоценённые оценки</span>
                <span className="text-orange-500">🟠 Высокий</span>
              </div>
              <Progress value={75} className="h-2 bg-orange-500/20 [&>div]:bg-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Нереалистичные ожидания</span>
                <span className="text-red-500">🔴 Критический</span>
              </div>
              <Progress value={85} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Сравнение с доткомами */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">💥 Доткомы (2000)</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Оценки компаний x100 от реальной выручки</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Бизнес-модели "рост любой ценой"</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>90% стартапов закрылись за 2 года</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Остались технологические гиганты</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">🤖 ИИ ({CURRENT_YEAR})</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Аналогичный ажиотаж вокруг генеративного ИИ</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Многие проекты без монетизации</span>
              </li>
              <li className="flex items-start gap-2">
                <Minus className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Ожидается консолидация рынка</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Технологии реальны и полезны</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Прогноз */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Прогноз при "сдутии" пузыря
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium text-emerald-600 mb-2">✅ Выживут:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• LLM, CV, ASR технологии</li>
                <li>• Компании с выручкой &gt;500 млн ₽</li>
                <li>• Экосистемные игроки (Сбер, Яндекс)</li>
                <li>• B2B-решения с измеримым ROI</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-amber-600 mb-2">⚠️ Высокий риск:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Генеративные модели без монетизации (70%)</li>
                <li>• Переоценённые LLM-проекты (60%)</li>
                <li>• Стартапы без unit-экономики (90%)</li>
                <li>• Консьюмер-приложения (50%)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-600 mb-2">📈 Индикаторы краха:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Падение венчурных инвестиций</li>
                <li>• Активность M&amp;A и консолидация</li>
                <li>• Требования к прибыльности</li>
                <li>• Снижение оценок стартапов</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Вывод */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Вывод:</strong> В отличие от пузыря доткомов, технологии ИИ реальны и приносят пользу. 
            Однако текущие оценки многих компаний завышены. При "сдутии" пузыря выживут компании с 
            реальным продуктом, выручкой и измеримым ROI. Рекомендуется фокусироваться на B2B-решениях 
            с чёткой бизнес-моделью.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Сравнение закрытого контура
// ============================================
function OnPremiseComparison() {
  const calculations = {
    corpgpt: {
      licenseYearly: 500000,
      deployment: 1500000,
      hardware: 8000000,
      maintenance: 600000,
      admin: 1200000,
      totalYear1: 11800000,
      totalYear2Plus: 2300000,
    },
    cloud: {
      perUser: 18000,
      users: 1000,
      totalYearly: 18000000,
    },
    ownInfra: {
      hardware: 15000000,
      setup: 3000000,
      admin: 2400000,
      electricity: 600000,
      totalYear1: 21000000,
      totalYear2Plus: 3000000,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Server className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Закрытый контур ИИ</h2>
          <p className="text-muted-foreground mt-1">Сравнение вариантов развёртывания для 1000 активных пользователей</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              CorpGPT On-Premise
            </CardTitle>
            <CardDescription>ПО для закрытого контура (серверы отдельно)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Лицензия (год):</span>
                <span className="font-medium">500 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Внедрение:</span>
                <span className="font-medium">1,5 млн ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сервер (A100/H100):</span>
                <span className="font-medium">8 млн ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Поддержка:</span>
                <span className="font-medium">600 000 ₽/год</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-emerald-600">11,8 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>2,3 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Оптимальный ROI</Badge>
              <Badge variant="outline" className="text-xs">152-ФЗ</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5 text-purple-600" />
              Облачный LLM
            </CardTitle>
            <CardDescription>SaaS без серверов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">На пользователя:</span>
                <span className="font-medium">18 000 ₽/год</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пользователей:</span>
                <span className="font-medium">1000</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-purple-600">18 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>18 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Быстрый старт</Badge>
              <Badge variant="outline" className="text-xs">Масштабирование</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5 text-orange-600" />
              Своя инфраструктура
            </CardTitle>
            <CardDescription>Open Source модели</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">2x A100 сервер:</span>
                <span className="font-medium">15 млн ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Внедрение:</span>
                <span className="font-medium">3 млн ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Администратор:</span>
                <span className="font-medium">2,4 млн ₽/год</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-purple-600">21 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>3 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Полный контроль</Badge>
              <Badge variant="outline" className="text-xs">Без зависимостей</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Сравнение за 3 года
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Критерий</th>
                  <th className="text-center p-3 font-medium">CorpGPT On-Premise</th>
                  <th className="text-center p-3 font-medium">Облачный LLM</th>
                  <th className="text-center p-3 font-medium">Своя инфраструктура</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">Стоимость за 3 года</td>
                  <td className="p-3 text-center text-emerald-600 font-semibold">16,4 млн ₽</td>
                  <td className="p-3 text-center">54,5 млн ₽</td>
                  <td className="p-3 text-center">27 млн ₽</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3">Время запуска</td>
                  <td className="p-3 text-center text-emerald-600">2-4 недели</td>
                  <td className="p-3 text-center text-emerald-600">1-2 недели</td>
                  <td className="p-3 text-center">2-3 месяца</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Безопасность данных</td>
                  <td className="p-3 text-center text-emerald-600">⭐⭐⭐⭐⭐</td>
                  <td className="p-3 text-center">⭐⭐⭐</td>
                  <td className="p-3 text-center text-emerald-600">⭐⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Рекомендация для 1000 пользователей
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Для организаций с требованиями к безопасности данных и бюджетом от 10 млн ₽ на внедрение 
            рекомендуется <strong>CorpGPT On-Premise</strong> как оптимальное соотношение цена/качество:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">ROI за 3 года</p>
              <p className="text-2xl font-bold">38 млн ₽</p>
              <p className="text-muted-foreground">экономия vs облако</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">Окупаемость</p>
              <p className="text-2xl font-bold">8 месяцев</p>
              <p className="text-muted-foreground">по сравнению с облаком</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">Стоимость на пользователя</p>
              <p className="text-2xl font-bold">5 500 ₽/год</p>
              <p className="text-muted-foreground">со 2-го года</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Подробнее о CorpGPT On-Premise</p>
              <p className="text-sm text-muted-foreground">Официальный сайт и документация</p>
            </div>
            <Button onClick={() => window.open('https://corpgpt.ru/', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Перейти на сайт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewVariant, setViewVariant] = useState<'A' | 'B'>('A')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Состояние для данных из API
  const [categories, setCategories] = useState<Category[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Состояние для CRUD диалогов
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null)

  // Загрузка данных из API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Загружаем категории и компании параллельно
        const [categoriesRes, companiesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/companies?limit=200')
        ])
        
        if (!categoriesRes.ok || !companiesRes.ok) {
          throw new Error('Ошибка загрузки данных')
        }
        
        const categoriesData = await categoriesRes.json()
        const companiesData = await companiesRes.json()
        
        setCategories(categoriesData)
        setCompanies(Array.isArray(companiesData) ? companiesData : (companiesData.companies || []))
        setError(null)
      } catch (err) {
        console.error('Ошибка загрузки:', err)
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // CRUD: Откры form dialog
  const openAddDialog = () => {
    setFormDialogOpen(true)
    setEditingCompany(null)
  }

  // CRUD: Open edit dialog
  const openEditDialog = (company: Company) => {
    setFormDialogOpen(true)
    setEditingCompany(company)
  }

  // CRUD: Open delete dialog
  const openDeleteDialog = (company: Company) => {
    setDeleteDialogOpen(true)
    setDeletingCompany(company)
  }

  // CRUD: Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingCompany) return
    
    try {
      const response = await fetch(`/api/companies/${deletingCompany.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Ошибка удаления')
      }

      // Refresh data
      await loadData()
      setDeleteDialogOpen(false)
      setDeletingCompany(null)
    } catch (err) {
      console.error('Ошибка удаления:', err)
    }
  }

  // CRUD: Refresh data after add/edit
  const handleFormSuccess = () => {
    loadData()
    setFormDialogOpen(false)
    setEditingCompany(null)
  }

  // Функция проверки совпадения компании с поисковым запросом
  const companyMatchesSearch = (company: Company, query: string): boolean => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return (
      company.name.toLowerCase().includes(q) ||
      company.description.toLowerCase().includes(q) ||
      company.features.some(f => f.toLowerCase().includes(q)) ||
      !!(company.inn && company.inn.includes(q)) ||
      !!(company.revenue && company.revenue.toLowerCase().includes(q))
    )
  }

  // Преобразование данных в формат techData
  const techData: Record<string, TechCategory> = {}
  
  categories.forEach(cat => {
    const catCompanies = companies.filter(c => c.categoryId === cat.id)
    const leaders = catCompanies.filter(c => c.status === 'leader')
    const others = catCompanies.filter(c => c.status === 'active')
    
    techData[cat.key] = {
      title: cat.title,
      description: cat.description,
      marketSize: cat.marketSize,
      growth: cat.growth,
      icon: iconMap[cat.iconName] || Brain,
      leaders,
      others
    }
  })

  // Определение вкладок с результатами поиска
  const getTabsWithResults = (query: string): string[] => {
    if (!query.trim()) return []
    const tabs: string[] = []
    Object.entries(techData).forEach(([key, data]) => {
      const allCompanies = [...data.leaders, ...data.others]
      if (allCompanies.some(c => companyMatchesSearch(c, query))) {
        tabs.push(key)
      }
    })
    return tabs
  }
  
  const tabsWithResults = getTabsWithResults(searchQuery)
  
  // Подсчёт уникальных лидеров
  const allLeaders = Object.values(techData).flatMap(d => d.leaders)
  const uniqueCompanies = new Set(allLeaders.map(c => c.name)).size

  // Состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ИИ в России {CURRENT_YEAR}</h1>
                <p className="text-sm text-muted-foreground">Аналитический обзор рынка: {uniqueCompanies}+ лидеров</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                <BarChart3 className="h-3 w-3 mr-1" />
                Аналитика
              </Badge>
              {/* Add Company Button - moved to Manage tab */}
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по компаниям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-[200px] md:w-[300px] rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="grid w-max grid-cols-8 h-auto gap-1 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 py-2 px-3">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Обзор</span>
              </TabsTrigger>
              <TabsTrigger value="llm" className="flex items-center gap-2 py-2 px-3 relative">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">LLM</span>
                {tabsWithResults.includes('llm') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2 py-2 px-3 relative">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Аудио</span>
                {tabsWithResults.includes('audio') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2 py-2 px-3 relative">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Видео</span>
                {tabsWithResults.includes('video') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="dl" className="flex items-center gap-2 py-2 px-3 relative">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">DL</span>
                {tabsWithResults.includes('dl') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="gen" className="flex items-center gap-2 py-2 px-3 relative">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Генерация</span>
                {tabsWithResults.includes('gen') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2 py-2 px-3">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Сравнение</span>
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2 py-2 px-3">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Риски</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2 py-2 px-3">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Управление</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Hero Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-5 w-5" />
                    <span>Рынок Big Data + ИИ</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.totalMarket}</p>
                  <p className="text-sm text-muted-foreground mt-1">{marketOverview.totalMarketNote}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Рынок ИИ напрямую: {marketOverview.directMarket}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                    <span>Темп роста</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.growth}</p>
                  <p className="text-sm text-muted-foreground mt-1">Источник: {marketOverview.growthSource}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span>Игроков рынка</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.companies}</p>
                  <p className="text-sm text-muted-foreground mt-1">Источник: Smart Ranking</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Rocket className="h-5 w-5" />
                    <span>Прогноз 2030</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.forecast2030}</p>
                  <p className="text-sm text-muted-foreground mt-1">{marketOverview.forecast2030Note}</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Структура рынка ИИ в России
                </CardTitle>
                <CardDescription>
                  Основные технологические направления по данным TAdviser ({CURRENT_YEAR})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Компьютерное зрение / Видеоаналитика</span>
                      <span className="text-sm text-muted-foreground">69%</span>
                    </div>
                    <Progress value={69} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Источник: TAdviser 2025</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">NLP / Речевые технологии</span>
                      <span className="text-sm text-muted-foreground">52%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Включает LLM, чат-боты, аудио</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">LLM (отдельно)</span>
                      <span className="text-sm text-muted-foreground">35 млрд ₽</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Источник: МТС / ICT Moscow</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Генеративный ИИ</span>
                      <span className="text-sm text-muted-foreground">Быстрорастущий</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Этап перехода от интереса к внедрению</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies by Category */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(techData).map(([key, data]) => (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <data.icon className="h-4 w-4" />
                      {data.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{data.leaders.length + data.others.length}</p>
                    <p className="text-sm text-muted-foreground">компаний</p>
                    <p className="text-xs text-emerald-600 mt-1">{data.leaders.length} лидеров</p>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Дополнительно
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('compare')}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Сравнение решений
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('risks')}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Риски пузыря
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sources */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Источники данных</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">TAdviser</Badge>
                  <Badge variant="outline">Smart Ranking</Badge>
                  <Badge variant="outline">CNews</Badge>
                  <Badge variant="outline">ICT Moscow</Badge>
                  <Badge variant="outline">Forbes Russia</Badge>
                  <Badge variant="outline">РБК Тренды</Badge>
                  <Badge variant="outline">Компьютерра</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Tabs */}
          {(['llm', 'audio', 'video', 'dl', 'gen'] as const).map((cat) => (
            <TabsContent key={cat} value={cat}>
              {/* View Variant Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Вариант отображения:</span>
                <div className="flex gap-1">
                  <Button 
                    variant={viewVariant === 'A' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewVariant('A')}
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    Классический
                  </Button>
                  <Button 
                    variant={viewVariant === 'B' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewVariant('B')}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Компактный
                  </Button>
                </div>
              </div>

              {techData[cat] && (viewVariant === 'A' ? (
                <CategorySectionVariantA 
                  title={techData[cat].title}
                  description={techData[cat].description}
                  marketSize={techData[cat].marketSize}
                  growth={techData[cat].growth}
                  leaders={techData[cat].leaders}
                  others={techData[cat].others}
                  icon={techData[cat].icon}
                  searchQuery={searchQuery}
                  companyMatchesSearch={companyMatchesSearch}
                  onEditCompany={openEditDialog}
                />
              ) : (
                <CategorySectionVariantB 
                  title={techData[cat].title}
                  description={techData[cat].description}
                  marketSize={techData[cat].marketSize}
                  growth={techData[cat].growth}
                  leaders={techData[cat].leaders}
                  others={techData[cat].others}
                  icon={techData[cat].icon}
                  searchQuery={searchQuery}
                  companyMatchesSearch={companyMatchesSearch}
                  onEditCompany={openEditDialog}
                />
              ))}
            </TabsContent>
          ))}

          {/* Compare Tab */}
          <TabsContent value="compare">
            <OnPremiseComparison />
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks">
            <BubbleRiskBlock />
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Управление компаниями</h2>
                  <p className="text-sm text-muted-foreground">
                    Всего: <span className="font-medium text-foreground">{companies.length}</span> компаний
                  </p>
                </div>
              </div>
              <Button onClick={openAddDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить компанию
              </Button>
            </div>

            {/* Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Категория:</span>
                    <select 
                      className="border rounded px-2 py-1 text-sm bg-background"
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          fetch(`/api/companies?categoryId=${value}`)
                            .then(res => res.json())
                            .then(data => setCompanies(Array.isArray(data) ? data : (data.companies || [])))
                        } else {
                          fetch('/api/companies')
                            .then(res => res.json())
                            .then(data => setCompanies(Array.isArray(data) ? data : (data.companies || [])))
                        }
                      }}
                    >
                      <option value="">Все категории</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Статус:</span>
                    <select 
                      className="border rounded px-2 py-1 text-sm bg-background"
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          fetch(`/api/companies?status=${value}`)
                            .then(res => res.json())
                            .then(data => setCompanies(Array.isArray(data) ? data : (data.companies || [])))
                        } else {
                          fetch('/api/companies')
                            .then(res => res.json())
                            .then(data => setCompanies(Array.isArray(data) ? data : (data.companies || [])))
                        }
                      }}
                    >
                      <option value="">Все</option>
                      <option value="leader">Лидеры</option>
                      <option value="active">Активные</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies List */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Компания</th>
                        <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Категория</th>
                        <th className="text-left p-3 text-sm font-medium hidden lg:table-cell">ИНН</th>
                        <th className="text-left p-3 text-sm font-medium">Статус</th>
                        <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Выручка</th>
                        <th className="p-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => openEditDialog(company)}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{company.name}</p>
                              {company.isPartner && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  Партнёр
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{company.description}</p>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {company.category?.title || '-'}
                            </Badge>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">{company.inn || '-'}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant={company.status === 'leader' ? 'default' : 'secondary'} className="text-xs">
                              {company.status === 'leader' ? 'Лидер' : 'Активный'}
                            </Badge>
                          </td>
                          <td className="p-3 hidden sm:table-cell">
                            <span className="text-sm">{company.revenue || '-'}</span>
                          </td>
                          <td className="p-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditDialog(company)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Аналитическая презентация российского рынка ИИ
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Данные актуальны на {CURRENT_YEAR} год • {uniqueCompanies}+ лидеров • Загружено из БД: {companies.length} компаний
            </div>
          </div>
        </div>
      </footer>

      {/* Company Form Dialog */}
      <CompanyFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        company={editingCompany}
        categories={categories}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        companyName={deletingCompany?.name || ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
