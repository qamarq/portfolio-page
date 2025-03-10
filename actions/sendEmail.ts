'use server'

import { verifyCaptcha } from '@/lib/recaptcha'
import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  captcha: z.string().min(1),
})

export const sendForm = actionClient
  .schema(formSchema)
  .action(
    async ({ parsedInput }: { parsedInput: z.infer<typeof formSchema> }) => {
      const captchaVerified = await verifyCaptcha(parsedInput.captcha)
      if (captchaVerified.error) {
        console.log(captchaVerified.error)
        return { failure: true, message: 'Captcha error' }
      }

      const { data, error } = await resend.emails.send({
        from: 'Kamil Marczak <hello@kamilmarczak.pl>',
        to: ['km.wpwp.pl@gmail.com'],
        replyTo: parsedInput.email,
        subject: 'New contact form message',
        react: EmailTemplate(parsedInput),
      })

      if (error) {
        console.log(error)
        return { failure: true, message: 'Failed to send email' }
      }

      return { success: true, data }
    }
  )
