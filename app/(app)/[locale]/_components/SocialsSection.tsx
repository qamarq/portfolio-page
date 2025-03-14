import config from '@payload-config'
import { getPayload } from 'payload'
import Socials from '@/components/socials'

export async function SocialsSection() {
  const payload = await getPayload({ config })

  const mainPageContent = await payload.findGlobal({
    slug: 'main-page',
  })

  return <Socials content={mainPageContent} />
}
