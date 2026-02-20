import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo'
import type { ClerkAPIError } from '@clerk/types'
import { router, useLocalSearchParams } from 'expo-router'
import { usePostHog } from 'posthog-react-native'
import * as React from 'react'
import type { TextStyle } from 'react-native'
import { View } from 'react-native'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'

const RESEND_CODE_INTERVAL_SECONDS = 30

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] }

export function VerifyEmailForm() {
  const posthog = usePostHog()
  const { signUp, setActive, isLoaded } = useSignUp()
  const { email = '' } = useLocalSearchParams<{ email?: string }>()
  const [code, setCode] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const [isLoading, setIsLoading] = React.useState(false)
  const { countdown, restartCountdown } = useCountdown(
    RESEND_CODE_INTERVAL_SECONDS,
  )

  async function onSubmit() {
    if (!isLoaded) return

    setIsLoading(true)

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      }
      posthog.captureException(err, { email, type: 'verify_email_form' })
    }

    setIsLoading(false)
  }

  async function onResendCode() {
    if (!isLoaded) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      restartCountdown()
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
      }
      posthog.captureException(err, { email, type: 'resend_code' })
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the verification code sent to {email || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                autoCapitalize="none"
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                textAlign="center"
                onSubmitEditing={onSubmit}
              />
              {!errors ? null : (
                <Text className="text-destructive text-sm font-medium">
                  {errors.map((e) => e.longMessage).join(', ')}
                </Text>
              )}
              <Button
                variant="link"
                size="sm"
                disabled={countdown > 0}
                onPress={onResendCode}
              >
                <Text className="text-center text-xs">
                  Didn&apos;t receive the code? Resend{' '}
                  {countdown > 0 ? (
                    <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                      ({countdown})
                    </Text>
                  ) : null}
                </Text>
              </Button>
            </View>
            <View className="gap-3">
              <Button
                disabled={isLoading || !code}
                className="w-full"
                onPress={onSubmit}
              >
                <Text>{isLoading ? 'Verifying...' : 'Continue'}</Text>
              </Button>
              <Button
                disabled={isLoading}
                variant="link"
                className="mx-auto"
                onPress={router.back}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  )
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [seconds])

  React.useEffect(() => {
    startCountdown()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startCountdown])

  return { countdown, restartCountdown: startCountdown }
}
