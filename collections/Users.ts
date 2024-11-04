import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
    slug: 'users',
    admin: {
        useAsTitle: 'email',
    },
    auth: true,
    fields: [
        {
            type: 'text',
            name: 'name',
            required: true,
        },
        {
            type: 'upload',
            name: 'avatar',
            relationTo: 'media',
        }
    ],
};
