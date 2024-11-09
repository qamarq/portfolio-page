import React from 'react'

export default function HomePageLayout({
    children,
    projects,
    contact,
}: Readonly<{
    children: React.ReactNode;
    projects: React.ReactNode;
    contact: React.ReactNode;
}>) {
    return (
        <>
            {children}
            {projects}
            {contact}
        </>
    )
}
