import { GlobalConfig } from 'payload'

const MainPage: GlobalConfig = {
  slug: 'main-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'linkedInLink',
          type: 'text',
          required: true,
        },
        {
          name: 'githubLink',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'text',
          required: true,
        },
        {
          name: 'discordName',
          type: 'text',
          required: true,
        },
        {
          name: 'discordId',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

export default MainPage
