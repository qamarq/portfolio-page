'use client';

import React, { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from './ui/textarea';
import { Icons } from './icons';
import { sendForm } from '@/actions/sendEmail';
import { toast } from 'sonner';
import Captcha from 'react-google-recaptcha';

const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
    captcha: z.string(),
});

export default function ContactForm() {
    const captchaRef = useRef<Captcha>(null);
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
            captcha: '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            try {
                const captcha = await captchaRef.current?.executeAsync();
                if (!captcha) {
                    toast.error('Captcha error');
                    return;
                }

                values.captcha = captcha
                const res = await sendForm(values);
                if (res?.data?.success) {
                    form.reset();
                    toast.success('Message sent successfully!');
                } else {
                    toast.error(res?.data?.message || 'Failed to send message');
                }

            } catch (error) {
                console.error(error);
                toast.error('Failed to send message');
            } finally {
                captchaRef.current?.reset();
            }
        });
    };

    return (
        <div style={{"--hero-width": "calc(100%)"} as React.CSSProperties} className='relative order-last md:order-first'>
            <div className='relative z-20 horizontal-line after:top-0'></div>
            <div className='relative p-10 bg-background/40 backdrop-blur-sm z-10'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Captcha
                            ref={captchaRef}
                            size="invisible"
                            className='hidden'
                            sitekey={process.env.NEXT_PUBLIC_CAPTCHA!}
                        />
                        <FormField
                            control={form.control}
                            disabled={isPending}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Smith" className='font-mono' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            disabled={isPending}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@domain.com" className='font-mono' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            disabled={isPending}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="I'm writing to you cause..." className='font-mono' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center justify-end gap-2'>
                            <Button type="reset" onClick={() => form.reset()} disabled={isPending} variant='outline'>Reset</Button>
                            <Button disabled={isPending} type="submit">{isPending && <Icons.Loading />} Submit form</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="vertical-line z-10"></div>
            <div className='relative horizontal-line z-10'></div>
            <div className="vertical-line !left-[unset] right-0 z-10"></div>
            <div className='absolute bottom-1/2 left-0 top-0 h-full w-full opacity-0 blur-[180px] [background-image:linear-gradient(to_bottom,#f43f5e,#f43f5e,transparent_40%)] animate-image-glow'></div>
        </div>
    );
}
