import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@instello/ui/components/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card className="rounded-2xl border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Instello Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-6 text-sm leading-relaxed">
          <p>Last updated: October 31, 2025</p>

          <p>
            Instello (“we”, “our”, or “us”) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our application (“App”) or
            related services.
          </p>

          <h2 className="text-foreground text-lg font-medium">
            1. Information We Collect
          </h2>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Account Information:</strong> We collect basic user data
              such as your email address and profile information through our
              authentication provider (Clerk).
            </li>
            <li>
              <strong>Subscription Data:</strong> We store information about
              your channel subscriptions, including coupon-based access codes
              and expiration dates.
            </li>
            <li>
              <strong>Usage Data:</strong> Non-personal data like app usage,
              device info, and crash logs may be collected to improve the app
              experience.
            </li>
          </ul>

          <h2 className="text-foreground text-lg font-medium">
            2. How We Use Your Data
          </h2>
          <p>Your information is used solely to:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Authenticate users and manage access to subscribed content.</li>
            <li>Provide, maintain, and improve app functionality.</li>
            <li>Communicate important updates or changes to the app.</li>
          </ul>

          <h2 className="text-foreground text-lg font-medium">
            3. Data Security
          </h2>
          <p>
            All user data transmitted through Instello is encrypted in transit
            using HTTPS (TLS). We follow industry-standard security practices to
            protect your information from unauthorized access.
          </p>

          <h2 className="text-foreground text-lg font-medium">
            4. Data Retention
          </h2>
          <p>
            We retain user data only as long as necessary to provide our
            services. When an account is deleted or a deletion request is made,
            associated data will be permanently removed from our systems within
            7 days.
          </p>

          <h2 className="text-foreground text-lg font-medium">
            5. Account Deletion
          </h2>
          <p>
            Currently, there is no in-app account deletion option. To request
            deletion of your account and data, please contact us at{' '}
            <a
              href="mailto:tech.jbportals@gmail.com"
              className="text-primary underline"
            >
              tech.jbportals@gmail.com
            </a>
            . Your data will be permanently deleted within 7 days of receiving
            the request.
          </p>

          <h2 className="text-foreground text-lg font-medium">
            6. Third-Party Services
          </h2>
          <p>
            Instello uses trusted third-party providers for authentication
            (Clerk) and analytics to ensure secure and reliable app performance.
            These services adhere to their own privacy and data protection
            standards.
          </p>

          <h2 className="text-foreground text-lg font-medium">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. Updates will be
            posted on this page with a revised “Last Updated” date.
          </p>

          <h2 className="text-foreground text-lg font-medium">8. Contact Us</h2>
          <p>
            For any questions or concerns about this Privacy Policy, please
            reach out to us at{' '}
            <a
              href="mailto:tech.jbportals@gmail.com"
              className="text-primary underline"
            >
              tech.jbportals@gmail.com
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
