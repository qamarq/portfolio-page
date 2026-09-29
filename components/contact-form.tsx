'use client'

import React, { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from './ui/textarea'
import { Icons } from './icons'
import { sendForm } from '@/actions/sendEmail'
import { toast } from 'sonner'
import Captcha from 'react-google-recaptcha'
import { usePlausible } from 'next-plausible'
import { useTranslations } from 'next-intl'

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  captcha: z.string(),
})

export default function ContactForm() {
  const t = useTranslations('Contact')
  const plausible = usePlausible()
  const captchaRef = useRef<Captcha>(null)
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      captcha: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const captcha = await captchaRef.current?.executeAsync()
        if (!captcha) {
          toast.error(t('captchaError'))
          return
        }

        values.captcha = captcha
        const res = await sendForm(values)
        if (res?.data?.success) {
          form.reset()
          toast.success(t('success'))
          plausible('Contact form submitted')
        } else {
          plausible('Contact form error')
          toast.error(t('error'))
        }
      } catch (error) {
        console.error(error)
        toast.error(t('error'))
        plausible('Contact form error')
      } finally {
        captchaRef.current?.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => form.handleSubmit(onSubmit)(event)}
        className="grid gap-[18px] self-start rounded-[22px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-soft"
      >
        {CAPTCHA_SITE_KEY && (
          <Captcha
            ref={captchaRef}
            size="invisible"
            className="hidden"
            sitekey={CAPTCHA_SITE_KEY}
          />
        )}
        <h3 className="type-h3 mb-1 text-[1.45rem] font-[680]">
          {t('formTitle')}
        </h3>
        <div className="grid gap-[18px] sm:grid-cols-2">
          <FormField
            control={form.control}
            disabled={isPending}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder={t('namePlaceholder')}
                    {...field}
                  />
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
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          disabled={isPending}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('messagePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <p className="font-mono text-[0.72rem] text-faint">{t('note')}</p>
          <Button
            disabled={isPending}
            type="submit"
            className="hover:[&_svg]:translate-x-[3px] hover:[&_svg]:-translate-y-[3px]"
          >
            {t('send')}
            {isPending ? <Icons.Loading /> : <Icons.ArrowUpRight />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
