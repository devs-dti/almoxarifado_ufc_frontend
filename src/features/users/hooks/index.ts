import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EntityId } from '@/shared/types/id'
import { usersApi } from '../api'
import type { CreateUserPayload, UpdateUserPayload } from '../types'

export const usersKeys = {
  all: ['users'] as const,
  list: (params?: object) => ['users', 'list', params] as const,
  detail: (id: EntityId) => ['users', 'detail', id] as const,
}

export function useUsers(params?: Parameters<typeof usersApi.list>[0]) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersApi.list(params),
  })
}

export function useUser(id: EntityId, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: options?.enabled,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: UpdateUserPayload }) => usersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: EntityId) => usersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  })
}
