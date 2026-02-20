'use client'

import { Tabs, TabsList, TabsTrigger } from '@instello/ui/components/tabs'
import { PaperPlaneTiltIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useParams, usePathname, useRouter } from 'next/navigation'

const items = [
  {
    title: 'Members',
    url: '',
    icon: UsersThreeIcon,
    exact: true,
  },
  {
    title: 'Invitations',
    url: '/invitations',
    icon: PaperPlaneTiltIcon,
  },
]

export function MembersTabs() {
  const { slug } = useParams<{
    slug: string
  }>()
  const baseUrl = `/${slug}/members`

  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="inline-flex w-full items-center gap-3">
      <Tabs value={pathname}>
        <TabsList className="h-9">
          {items.map((item, i) => (
            <TabsTrigger
              onClick={() => router.push(`${baseUrl}${item.url}`)}
              key={`items-${i + 1}`}
              value={`${baseUrl}${item.url}`}
              className="text-xs"
            >
              <item.icon weight="duotone" />
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
