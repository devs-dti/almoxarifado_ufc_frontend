import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { materialGroupsApi } from '../api'

export const materialGroupsKeys = {
  all: ['materialGroups'] as const,
  lists: () => [...materialGroupsKeys.all, 'list'] as const,
  list: (filters: string) => [...materialGroupsKeys.lists(), { filters }] as const,
}

export function useMaterialGroups(params?: { page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: materialGroupsKeys.list(JSON.stringify(params)),
    queryFn: () => materialGroupsApi.list(params),
  })
}

export function useCreateMaterialGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: materialGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialGroupsKeys.lists() })
    },
  })
}

export function useUpdateMaterialGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof materialGroupsApi.update>[1] }) =>
      materialGroupsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialGroupsKeys.lists() })
    },
  })
}

export function useDeleteMaterialGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: materialGroupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialGroupsKeys.lists() })
    },
  })
}
