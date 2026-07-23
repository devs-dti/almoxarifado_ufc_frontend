export type Sector = {
  id: string
  name: string
  code?: string
  deletedAt?: string | null
}

export type CreateSectorPayload = {
  name: string
}

export type UpdateSectorPayload = Partial<CreateSectorPayload>

export type MeasurementUnit = {
  id: string
  name: string
  abbreviation: string
  deletedAt?: string | null
}

export type CreateMeasurementUnitPayload = {
  name: string
  abbreviation: string
}

export type UpdateMeasurementUnitPayload = Partial<CreateMeasurementUnitPayload>
