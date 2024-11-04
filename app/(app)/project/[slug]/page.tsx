import { useRouter } from 'next/router';
import React from 'react';

export default function ProjectPage() {
    const router = useRouter()
    return (
        <div className='pt-24 container mx-auto'>ProjectPage - WiP - {router.query.slug}</div>
    );
}
