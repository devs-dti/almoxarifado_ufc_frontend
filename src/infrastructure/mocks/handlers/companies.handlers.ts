import { http, HttpResponse } from 'msw'
import type { Company, CompanyDTO } from '@/features/companies/types'

const companies: Company[] = Array.from({ length: 15 }).map((_, i) => ({
  id: crypto.randomUUID(),
  sei: `SEI-00${i + 1}`,
  name: `Empresa ${i + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

export function getMockCompanies() { return companies.filter((company) => !company.deletedAt) }

export const companiesHandlers = [
  // Listar empresas
  http.get('/companies', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const search = url.searchParams.get('search')

    let activeCompanies = companies.filter((c) => !c.deletedAt)

    if (search) {
      activeCompanies = activeCompanies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sei.toLowerCase().includes(search.toLowerCase())
      )
    }

    const direction = url.searchParams.get('sort')?.endsWith(',desc') ? -1 : 1
    activeCompanies.sort((a, b) => a.name.localeCompare(b.name) * direction)
    const data = activeCompanies.slice(page * size, page * size + size)

    return HttpResponse.json({
      data,
      meta: {
        page,
        size,
        totalElements: activeCompanies.length,
        totalPages: Math.ceil(activeCompanies.length / size)
      }
    })
  }),

  // Buscar por ID
  http.get('/companies/:id', ({ params }) => {
    const c = companies.find((c) => c.id === params.id && !c.deletedAt)
    if (!c) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(c)
  }),

  // Criar empresa
  http.post('/companies', async ({ request }) => {
    const body = await request.json() as CompanyDTO
    const newCompany: Company = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    companies.unshift(newCompany) // Add to top for better UX in mock
    return HttpResponse.json(newCompany, { status: 201 })
  }),

  // Atualizar (Patch)
  http.patch('/companies/:id', async ({ request, params }) => {
    const idx = companies.findIndex((c) => c.id === params.id && !c.deletedAt)
    if (idx === -1) return new HttpResponse(null, { status: 404 })

    const body = await request.json() as Partial<CompanyDTO>
    companies[idx] = { ...companies[idx], ...body, updatedAt: new Date().toISOString() }

    return HttpResponse.json(companies[idx])
  }),

  // Excluir (Soft delete)
  http.delete('/companies/:id', ({ params }) => {
    const idx = companies.findIndex((c) => c.id === params.id && !c.deletedAt)
    if (idx === -1) return new HttpResponse(null, { status: 404 })

    // Simulate error if company has active contracts
    // We don't have real contract logic here, so we just allow delete.
    // If we wanted to test the error, we could hardcode an ID to fail.

    companies[idx] = { ...companies[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
