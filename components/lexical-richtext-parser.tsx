/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

/* eslint-disable @next/next/no-img-element */
import { Project } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { Tweet } from 'react-tweet'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ElementProps {
  children?: ElementProps[]
  direction: 'ltr' | 'rtl'
  type:
    | 'paragraph'
    | 'heading'
    | 'text'
    | 'quote'
    | 'horizontalrule'
    | 'link'
    | 'upload'
    | 'linebreak'
    | 'list'
    | 'listitem'
    | 'block'
    | 'autolink'
  format: '' | 'center' | 'right' | 'justify'
  version: number
  textFormat: number

  // text element
  text?: string
  detail?: number
  style?: string

  // heading
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  fields?: {
    //link
    newTab: boolean
    url: string

    //blocks
    blockName: string
    blockType: string
    id: string
    tweetId?: string

    //autolink
    linkType: string
  }

  //media
  relationTo?: string
  value?: {
    url: string
    thumbnailURL: string
    height: number
    width: number
  }

  listType?: 'number' | null
}

const states = {
  IS_BOLD: 1,
  IS_ITALIC: 1 << 1,
  IS_STRIKETHROUGH: 1 << 2,
  IS_UNDERLINE: 1 << 3,
  IS_CODE: 1 << 4,
  IS_SUBSCRIPT: 1 << 5,
  IS_SUPERSCRIPT: 1 << 6,
  IS_HIGHLIGHT: 1 << 7,
}

const tailwindClasses = {
  IS_BOLD: 'font-bold',
  IS_ITALIC: 'italic',
  IS_STRIKETHROUGH: 'line-through',
  IS_UNDERLINE: 'underline',
  IS_CODE: 'font-mono',
  IS_SUBSCRIPT: 'sub',
  IS_SUPERSCRIPT: 'super',
  IS_HIGHLIGHT: 'bg-yellow-100',
}

const getFormattingStates = (decimalNumber: number) => {
  if (!decimalNumber) {
    return {
      IS_BOLD: false,
      IS_ITALIC: false,
      IS_STRIKETHROUGH: false,
      IS_UNDERLINE: false,
      IS_CODE: false,
      IS_SUBSCRIPT: false,
      IS_SUPERSCRIPT: false,
      IS_HIGHLIGHT: false,
    }
  }
  const binaryString = decimalNumber.toString(2).padStart(8, '0')

  const formattingStates: Record<keyof typeof states, boolean> = {} as Record<
    keyof typeof states,
    boolean
  >
  ;(Object.keys(states) as (keyof typeof states)[])
    .reverse()
    .forEach((state, index) => {
      if (binaryString[index] === '1') {
        formattingStates[state] = true
      }
    })
  return formattingStates
}

const randomUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const serializeLexicalEditor = (
  lexicalEditorContent: Project['content']
) => {
  return (
    <Element
      childrens={lexicalEditorContent.root.children as any}
      key={randomUUID()}
    />
  )
}

const Element = ({ childrens }: { childrens: ElementProps[] }) => {
  const { theme } = useTheme()
  return childrens.map((child) => {
    let formattedClasses = ''
    let formatToProvide = child.textFormat
    if (formatToProvide === null || formatToProvide === undefined) {
      if (typeof child.format === 'number') {
        formatToProvide = child.format
      }
    }
    const formattingStates: Record<keyof typeof states, boolean> =
      getFormattingStates(formatToProvide)
    Object.keys(formattingStates).map((item) => {
      if (formattingStates[item as keyof typeof states]) {
        formattedClasses += tailwindClasses[item as keyof typeof states] + ' '
      }
    })
    switch (child.type) {
      case 'paragraph':
        return (
          <p
            key={randomUUID()}
            className={cn(formattedClasses, 'text-md font-inter', {
              'text-right': child.format === 'right',
              'text-center': child.format === 'center',
              'text-justify': child.format === 'justify',
              'h-10': !child.children || child.children.length === 0,
            })}
          >
            {child.children && child.children.length > 0 ? (
              <Element childrens={child.children || []} key={randomUUID()} />
            ) : (
              <span key={randomUUID()} />
            )}
          </p>
        )
      case 'heading':
        const Tag = child.tag || 'h1'
        return (
          <Tag
            key={randomUUID()}
            className={cn(formattedClasses, 'font-semibold font-cal', {
              'text-4xl font-bold': child.tag === 'h1',
              'text-3xl font-bold': child.tag === 'h2',
              'text-2xl': child.tag === 'h3',
              'text-xl': child.tag === 'h4',
              'text-lg': child.tag === 'h5',
              'text-md': child.tag === 'h6',
            })}
          >
            {<Element childrens={child.children || []} key={randomUUID()} />}
          </Tag>
        )
      case 'text':
        return (
          <span key={randomUUID()} className={formattedClasses}>
            {child.text}
          </span>
        )
      case 'linebreak':
        return <br key={randomUUID()} />
      case 'link':
        return (
          <Link
            key={randomUUID()}
            className="text-rose-500 dark:text-rose-500"
            href={child.fields?.url || ''}
            target={child.fields?.newTab ? '_blank' : ''}
          >
            {<Element childrens={child.children || []} key={randomUUID()} />}
          </Link>
        )
      case 'autolink':
        return (
          <Link
            key={randomUUID()}
            className="text-rose-500 dark:text-rose-500"
            href={child.fields?.url || ''}
            target={child.fields?.newTab ? '_blank' : ''}
          >
            {<Element childrens={child.children || []} key={randomUUID()} />}
          </Link>
        )
      case 'quote':
        return (
          <blockquote
            key={randomUUID()}
            className="text-xl italic font-semibold text-gray-900 dark:text-white border-zinc-400 bg-white/5 p-4 my-4 border-l-4 "
          >
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <p>{<Element childrens={child.children || []} />}</p>
          </blockquote>
        )
      case 'horizontalrule':
        return (
          <hr
            key={randomUUID()}
            className="h-[1px] my-4 bg-zinc-600 rounded-lg"
          />
        )
      case 'upload':
        return (
          <Image
            key={randomUUID()}
            src={child.value?.url || ''}
            width={500}
            height={500}
            alt=""
            className="h-full w-full text-transparent object-cover rounded-lg"
            unoptimized
          />
        )
      case 'list':
        return (
          <ul
            key={randomUUID()}
            className={cn('ml-2 list-inside space-y-2', {
              'list-disc': child.listType !== 'number',
              'list-decimal': child.listType === 'number',
            })}
          >
            {<Element childrens={child.children || []} />}
          </ul>
        )
      case 'listitem':
        return (
          <li key={randomUUID()}>
            {<Element childrens={child.children || []} />}
          </li>
        )
      case 'block':
        if (child.fields && child.fields.blockType === 'tweet') {
          return (
            <div
              key={randomUUID()}
              data-theme={theme}
              className="w-full flex items-center justify-center"
            >
              <Tweet id={child.fields.tweetId || ''} />
            </div>
          )
        }
    }
  })
}
