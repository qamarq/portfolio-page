import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
// import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default withPayload(nextConfig)
