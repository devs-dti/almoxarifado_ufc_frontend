export type MaterialGroup = {
  id: string
  name: string
  deletedAt?: string | null
}

export type CreateMaterialGroupPayload = {
  name: string
}

export type UpdateMaterialGroupPayload = {
  name?: string
}
