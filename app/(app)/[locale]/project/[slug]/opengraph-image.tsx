import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cacheLife, cacheTag } from 'next/cache'
import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import sharp from 'sharp'
import { type Locales, routing } from '@/i18n/routing'
import { getProject } from '@/lib/content'
import widths from '@/assets/fonts/MonaSans-Display.widths.json'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const font = (file: string) =>
  readFile(join(process.cwd(), 'assets/fonts', file))

const fonts = Promise.all([
  font('MonaSans-Display.ttf'),
  font('MonaSans-Label.ttf'),
  font('MonaSans-Text.ttf'),
  font('GeistMono-Regular.ttf'),
]).then(([display, label, text, mono]) => [
  { name: 'Display', data: display },
  { name: 'Label', data: label },
  { name: 'Text', data: text },
  { name: 'Mono', data: mono },
])

const colors = {
  bg: '#0b0909',
  panel: '#171314',
  line: '#2a2325',
  fg: '#f5eff0',
  muted: '#a39a9d',
  faint: '#6f6568',
  accent: '#f43f5e',
}

const TITLE_WIDTH = 480

const measure = (text: string, fontSize: number) =>
  [...text].reduce(
    (total, char) =>
      total + ((widths as Record<string, number>)[char] ?? 0.6) - 0.045,
    0
  ) * fontSize

function wrap(words: string[], fontSize: number) {
  return words.reduce<string[]>((lines, word) => {
    const joined = lines.length ? `${lines.at(-1)} ${word}` : word
    if (lines.length && measure(joined, fontSize) <= TITLE_WIDTH)
      lines[lines.length - 1] = joined
    else lines.push(word)
    return lines
  }, [])
}

function fitTitle(title: string) {
  const words = title.split(' ')
  for (const [maxLines, minSize] of [
    [1, 72],
    [2, 48],
  ]) {
    for (let fontSize = 92; fontSize >= minSize; fontSize -= 2) {
      const lines = wrap(words, fontSize)
      if (
        lines.length <= maxLines &&
        lines.every((line) => measure(line, fontSize) <= TITLE_WIDTH)
      )
        return fontSize
    }
  }
  return 48
}

export async function generateImageMetadata({
  params,
}: {
  params: { locale?: string; slug: string }
}) {
  const project =
    params.locale && hasLocale(routing.locales, params.locale)
      ? await getProject(params.locale, params.slug)
      : undefined
  const alt = project ? `${project.title} · Kamil Marczak` : 'Kamil Marczak'
  return [{ id: 'card', alt, size, contentType }]
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const project = await getProject(locale, slug)
  if (!project) notFound()
  return new Response(await renderCard(locale, slug), {
    headers: { 'Content-Type': contentType },
  })
}

async function renderCard(locale: Locales, slug: string) {
  'use cache'
  cacheLife('max')
  cacheTag('content')

  const project = (await getProject(locale, slug))!
  const cover = await sharp(join(process.cwd(), 'public', project.cover))
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  const host = project.url
    ? new URL(project.url).host.replace(/^www\./, '')
    : 'kamilmarczak.pl'
  const meta = [project.type, project.org].filter(Boolean).join(' · ')
  const titleSize = fitTitle(project.title)

  const image = new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: colors.bg,
          color: colors.fg,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: `linear-gradient(rgba(255,240,243,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,240,243,0.045) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: `radial-gradient(circle at 18% 6%, rgba(244,63,94,0.22), rgba(11,9,9,0) 48%), radial-gradient(circle at 30% 30%, rgba(11,9,9,0) 30%, ${colors.bg} 78%)`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 590,
            top: 176,
            width: 700,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 20,
            border: `1px solid ${colors.line}`,
            backgroundColor: colors.panel,
            boxShadow: '0 40px 90px -20px rgba(0,0,0,0.8)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 18px',
              borderBottom: `1px solid ${colors.line}`,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 11,
                  backgroundColor: colors.line,
                }}
              />
            ))}
            <div
              style={{
                display: 'flex',
                marginLeft: 150,
                padding: '4px 14px',
                borderRadius: 7,
                backgroundColor: colors.bg,
                fontFamily: 'Mono',
                fontSize: 15,
                color: colors.faint,
              }}
            >
              {host}
            </div>
          </div>
          <img
            alt=""
            src={`data:image/jpeg;base64,${cover.toString('base64')}`}
            width={700}
            height={438}
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: 520,
            height: '100%',
            padding: '56px 0 56px 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: 12,
                border: `1px solid ${colors.line}`,
                borderBottomWidth: 2,
                backgroundColor: '#120f10',
              }}
            >
              <svg width="28" height="21" viewBox="5 12 54 40">
                <path
                  fill={colors.fg}
                  d="M7.04 14h10.5v36H7.04zM29.45 14h13.17L15.2 46H9.04v-8.18zM14.54 29h13.05l15.47 21H30.02z"
                />
                <circle cx="51.76" cy="44.8" r="5.2" fill={colors.accent} />
              </svg>
            </div>
            <div
              style={{ fontFamily: 'Label', fontSize: 22, letterSpacing: -0.4 }}
            >
              kamilmarczak.pl
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: 'Mono',
                fontSize: 17,
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                color: colors.muted,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: colors.accent,
                }}
              />
              {meta}
            </div>
            <div
              style={{
                marginTop: 22,
                fontFamily: 'Display',
                width: TITLE_WIDTH,
                fontSize: titleSize,
                lineHeight: 0.92,
                letterSpacing: titleSize * -0.045,
              }}
            >
              {project.title}
            </div>
            <div
              style={{
                marginTop: 24,
                fontFamily: 'Text',
                fontSize: 24,
                lineHeight: 1.45,
                color: colors.muted,
                display: 'block',
                lineClamp: 3,
              }}
            >
              {project.description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 32,
            }}
          >
            {project.tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '6px 12px',
                  borderRadius: 9,
                  border: `1px solid ${colors.line}`,
                  fontFamily: 'Mono',
                  fontSize: 16,
                  color: colors.muted,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {project.stat && (
          <div
            style={{
              position: 'absolute',
              right: 56,
              top: 62,
              display: 'flex',
              padding: '8px 16px',
              borderRadius: 999,
              border: `1px solid rgba(244,63,94,0.35)`,
              backgroundColor: 'rgba(244,63,94,0.12)',
              fontFamily: 'Mono',
              fontSize: 17,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: colors.accent,
            }}
          >
            {project.stat}
          </div>
        )}
      </div>
    ),
    { ...size, fonts: await fonts }
  )
  return new Uint8Array(await image.arrayBuffer())
}
