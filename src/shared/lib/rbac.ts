import type { Role } from '@/features/auth/types'

export function hasAnyRole(role: Role | undefined, allowed: Role[]): boolean {
  return Boolean(role && allowed.includes(role))
}
