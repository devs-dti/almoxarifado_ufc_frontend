import { authHandlers } from './handlers/auth.handlers'
import { materialsHandlers } from './handlers/materials.handlers'
import { entriesHandlers } from './handlers/entries.handlers'
import { transfersHandlers } from './handlers/transfers.handlers'
import { usersHandlers } from './handlers/users.handlers'
import { sectorsHandlers } from './handlers/sectors.handlers'
import { suppliersHandlers } from './handlers/suppliers.handlers'
import { reportsHandlers } from './handlers/reports.handlers'
import { contractsHandlers } from './handlers/contracts.handlers'
import { companiesHandlers } from './handlers/companies.handlers'
import { materialAuditsHandlers } from './handlers/material-audits.handlers'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...entriesHandlers,
  ...transfersHandlers,
  ...usersHandlers,
  ...sectorsHandlers,
  ...suppliersHandlers,
  ...reportsHandlers,
  ...contractsHandlers,
  ...companiesHandlers,
  ...materialAuditsHandlers,
]
