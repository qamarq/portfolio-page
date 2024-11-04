import React from 'react';

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <div className='pt-24 container mx-auto'>ProjectPage - WiP - {params.slug}</div>
    );
}
