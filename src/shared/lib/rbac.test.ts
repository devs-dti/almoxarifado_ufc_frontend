import { describe, expect, it } from 'vitest'

import { hasAnyRole } from './rbac'

describe('hasAnyRole', () => {
  it('allows users that have one of the requested roles', () => {
    expect(hasAnyRole('MANAGER', ['ADMIN', 'MANAGER'])).toBe(true)
  })

  it('denies users without the requested roles', () => {
    expect(hasAnyRole('STAFF', ['ADMIN', 'MANAGER'])).toBe(false)
  })

  it('denies anonymous users', () => {
    expect(hasAnyRole(undefined, ['ADMIN'])).toBe(false)
  })
})
