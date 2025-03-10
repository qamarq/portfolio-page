import { slugField } from '@/components/payload/fields/slug'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/project/${data.slug}`
      },
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'upload',
      name: 'heroImage',
      required: true,
      relationTo: 'media',
    },
    {
      type: 'text',
      name: 'title',
      required: true,
    },
    {
      type: 'textarea',
      name: 'shortDescription',
      required: true,
    },
    {
      type: 'text',
      name: 'tags',
      required: true,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'text',
      name: 'githubLink',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'text',
      name: 'previewUrl',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'relationship',
      relationTo: 'users',
      name: 'authors',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'richText',
      name: 'content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: 'tweet',
                fields: [
                  {
                    name: 'tweetId',
                    type: 'text',
                    required: true,
                  },
                ],
              },
            ],
          }),
        ],
      }),
      required: true,
    },
    {
      type: 'upload',
      name: 'images',
      relationTo: 'media',
      hasMany: true,
    },
    slugField(),
  ],
}
