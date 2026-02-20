import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@instello/ui/components/card'
import { Separator } from '@instello/ui/components/separator'
import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Account Deletion | Instello',
  description:
    'Learn how to request deletion of your Instello account and associated data.',
}

export default function AccountDeletionPage() {
  return (
    <main className="flex min-h-screen justify-center">
      <Card className="w-full max-w-lg border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Instello Account Deletion Request
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 leading-relaxed">
          <p>
            Currently, <strong>Instello</strong> does not provide an in-app
            feature to delete your account. However, if you would like to
            permanently delete your account and all associated data, you can
            request it manually.
          </p>

          <p>To request account deletion, please send an email to:</p>

          <div className="bg-accent flex items-center gap-2 rounded-lg p-3">
            <Mail className="text-accent-foreground h-5 w-5" />
            <a
              href="mailto:tech.jbportals@gmail.com"
              className="font-medium text-blue-600 hover:underline"
            >
              tech.jbportals@gmail.com
            </a>
          </div>

          <p>
            Once we receive your verified request, your account and related data
            will be permanently removed from our systems within{' '}
            <strong>7 days</strong>.
          </p>

          <p className="text-muted-foreground text-sm">
            Please note: This process is irreversible once completed.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
