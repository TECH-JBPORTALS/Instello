import { createLoader, parseAsString } from 'nuqs/server'

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const querySearchParams = {
  q: parseAsString.withDefault(''),
}

export const loadQuerySearchParams = createLoader(querySearchParams)
