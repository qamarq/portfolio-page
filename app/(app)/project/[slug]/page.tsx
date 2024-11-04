import React from 'react';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    
    return (
        <div className='pt-24 container mx-auto'>ProjectPage - WiP - {slug}</div>
    );
}
