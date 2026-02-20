import { DrizzleQueryError } from 'drizzle-orm/errors'

export { getTableColumns } from 'drizzle-orm'
export { DrizzleQueryError } from 'drizzle-orm/errors'
export { alias, PgTransaction } from 'drizzle-orm/pg-core'
export * from 'drizzle-orm/sql'

export function isDrizzleQueryError(
  error: unknown,
): error is DrizzleQueryError & {
  cause: Error & { code: string; constraint: string }
} {
  return (
    error instanceof DrizzleQueryError &&
    typeof error.cause === 'object' &&
    'code' in error.cause
  )
}
