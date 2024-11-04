import { slugField } from '@/components/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'title',
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
            }
        },
        {
            type: 'text',
            name: 'githubLink',
            admin: {
                position: 'sidebar',
            }
        },
        {
            type: 'text',
            name: 'previewUrl',
            admin: {
                position: 'sidebar',
            }
        },
        {
            type: 'richText',
            name: 'content',
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
};
