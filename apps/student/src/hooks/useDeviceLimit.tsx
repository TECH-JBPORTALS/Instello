import { useSession, useUser } from '@clerk/clerk-expo'
import type { SessionWithActivitiesResource } from '@clerk/types'
import type { PostHog } from 'posthog-react-native'
import { usePostHog } from 'posthog-react-native'
import { useCallback, useEffect, useState } from 'react'

export interface UseDeviceLimitResult {
  blocked: boolean
  otherSessions: SessionWithActivitiesResource[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  signOutOtherDevices: () => Promise<void>
}

export function useDeviceLimit(): UseDeviceLimitResult {
  const { user, isLoaded } = useUser()
  const { session } = useSession()
  const posthog = usePostHog()

  const [otherSessions, setOtherSessions] = useState<
    SessionWithActivitiesResource[]
  >([])
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const trackError = useCallback(
    (e: unknown) => {
      const err = e instanceof Error ? e : new Error('Unknown error')
      const client = posthog as PostHog | null

      if (client && typeof client.capture === 'function') {
        client.capture('device_limit_error', {
          message: err.message,
          name: err.name,
        })
      }

      setError(err)
    },
    [posthog],
  )

  const refresh = useCallback(async () => {
    if (!isLoaded || !user || !session) return

    setError(null)

    try {
      await user.reload()

      const sessions = await user.getSessions()

      const activeOtherSessions = sessions.filter(
        (s) => s.id !== session.id && s.status === 'active',
      )

      setOtherSessions(activeOtherSessions)
      setBlocked(activeOtherSessions.length > 0)
    } catch (e) {
      trackError(e)
    }
  }, [isLoaded, session, trackError, user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signOutOtherDevices = useCallback(async () => {
    if (!otherSessions.length) return

    setLoading(true)
    setError(null)

    try {
      for (const s of otherSessions) {
        await s.revoke()
      }

      // After revoking, re-check the active sessions to keep state in sync.
      await refresh()
    } catch (e) {
      trackError(e)
    } finally {
      setLoading(false)
    }
  }, [otherSessions, refresh, trackError])

  return {
    blocked,
    otherSessions,
    loading,
    error,
    refresh,
    signOutOtherDevices,
  }
}
