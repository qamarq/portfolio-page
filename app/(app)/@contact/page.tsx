import React from 'react'
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from '@payload-config'
import ContactForm from "@/components/contact-form";
import Socials from "@/components/socials";

export default async function ContactPage() {
    const payload = await getPayloadHMR({ config })

    const mainPageContent = await payload.findGlobal({
        slug: 'main-page',
    })

    return (
        <section className="max-w-6xl mx-auto py-20 mb-36" id="contact">
            <h1 className="w-full text-center font-cal translate-y-1 text-5xl"><span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">Contact</span> me</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-32 px-5 md:px-0">
                <ContactForm />
                <Socials content={mainPageContent} />
            </div>
        </section>
    )
}
