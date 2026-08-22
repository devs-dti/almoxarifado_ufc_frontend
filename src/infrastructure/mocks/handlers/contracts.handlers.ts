import { http, HttpResponse } from 'msw'
import type { Contract, ContractDTO } from '@/features/contracts/types'

const MOCK_COMPANIES = [
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'Odonto Corp' },
  { id: '77785f64-5717-4562-b3fc-2c963f66afa6', name: 'Fornecedora ABC' },
]

const MOCK_USERS = [
  { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'João Admin' },
  { id: '2', name: 'Maria Fiscal' },
]

// Geração do mock de contratos
const contracts: Contract[] = Array.from({ length: 15 }).map((_, i) => {
  const company = i % 2 === 0 ? MOCK_COMPANIES[0] : MOCK_COMPANIES[1]
  return {
    id: crypto.randomUUID(),
    referenceNumber: `CTR-00${i + 1}`,
    startDate: new Date(2025, i % 12, 1).toISOString(),
    endDate: new Date(2026, i % 12, 1).toISOString(),
    status: i % 4 !== 0,
    companyName: company.name,
    userIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})

export const contractsHandlers = [
  // Listar contratos 
  http.get('/contracts', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const companyName = url.searchParams.get('companyName')
    
    let activeContracts = contracts.filter((c) => !c.deletedAt)

    if (search) {
      activeContracts = activeContracts.filter(c => c.referenceNumber.toLowerCase().includes(search.toLowerCase()))
    }
    
    if (status !== null) {
      const statusBool = status === 'true'
      activeContracts = activeContracts.filter(c => c.status === statusBool)
    }

    if (companyName) {
      activeContracts = activeContracts.filter(c => c.companyName.toLowerCase().includes(companyName.toLowerCase()))
    }

    const data = activeContracts.slice(page * size, page * size + size).map(c => ({
      ...c,
      users: MOCK_USERS.filter(u => c.userIds.includes(u.id))
    }))
    
    return HttpResponse.json({ 
      data, 
      meta: {
        page,
        size,
        totalElements: activeContracts.length, 
        totalPages: Math.ceil(activeContracts.length / size)
      }
    })
  }),

  // Buscar por ID
  http.get('/contracts/:id', ({ params }) => {
    const c = contracts.find((c) => c.id === params.id && !c.deletedAt)
    if (!c) return new HttpResponse(null, { status: 404 })
    
    const populated = {
      ...c,
      users: MOCK_USERS.filter(u => c.userIds.includes(u.id))
    }
    return HttpResponse.json(populated)
  }),

  // Criar contrato
  http.post('/contracts', async ({ request }) => {
    const body = await request.json() as ContractDTO
    const company = MOCK_COMPANIES.find(c => c.id === body.companyId)
    const newContract: Contract = {
      ...body,
      companyName: company?.name || 'Unknown',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    contracts.push(newContract)
    return HttpResponse.json(newContract, { status: 201 })
  }),

  // Renovar contrato
  http.post('/contracts/:id/renew', async ({ request, params }) => {
    const idx = contracts.findIndex((c) => c.id === params.id && !c.deletedAt)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
      
    const body = await request.json() as { referenceNumber: string, startDate: string, endDate: string }
    
    // Desativa o atual
    contracts[idx] = { ...contracts[idx], status: false, updatedAt: new Date().toISOString() }

    // Cria o novo mantendo vinculos
    const newContract: Contract = {
      id: crypto.randomUUID(),
      referenceNumber: body.referenceNumber,
      startDate: body.startDate,
      endDate: body.endDate,
      status: true,
      companyName: contracts[idx].companyName,
      userIds: contracts[idx].userIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    contracts.push(newContract)
    return HttpResponse.json(newContract, { status: 201 })
  }),

  // Atualizar (Patch)
  http.patch('/contracts/:id', async ({ request, params }) => {
    const idx = contracts.findIndex((c) => c.id === params.id && !c.deletedAt)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    
    const body = await request.json() as Partial<ContractDTO>
    
    let updatedCompanyName = contracts[idx].companyName
    if (body.companyId) {
      const company = MOCK_COMPANIES.find(c => c.id === body.companyId)
      if (company) updatedCompanyName = company.name
    }
    
    contracts[idx] = { 
      ...contracts[idx], 
      ...body, 
      companyName: updatedCompanyName,
      updatedAt: new Date().toISOString() 
    }
    
    return HttpResponse.json(contracts[idx])
  }),

  // Excluir (Soft delete)
  http.delete('/contracts/:id', ({ params }) => {
    const idx = contracts.findIndex((c) => c.id === params.id && !c.deletedAt)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    
    // Apenas contratos inativos podem ser removidos segundo o Swagger
    if (contracts[idx].status === true) {
       return HttpResponse.json({
         timestamp: new Date().toISOString(),
         status: 400,
         error: "Bad Request",
         message: "Apenas contratos inativos podem ser removidos",
         path: `/contracts/${params.id}`
       }, { status: 400 })
    }

    contracts[idx] = { ...contracts[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
