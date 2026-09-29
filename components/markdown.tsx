import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'

function Stats({ data }: { data: string }) {
  const items = data.split(';').map((entry) => {
    const [value, label] = entry.split('|')
    return { value: value.trim(), label: label?.trim() }
  })

  return (
    <div className="my-2 mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.value} className="grid gap-1 bg-panel p-[18px]">
          <b className="font-display text-[1.7rem] leading-none font-[700] tracking-[-0.03em] tabular-nums [font-stretch:110%]">
            {item.value}
          </b>
          <span className="text-[0.82rem] text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function ExternalLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = props.href?.startsWith('http')
  return (
    <a
      {...props}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    />
  )
}

export function MarkdownContent({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div className={cn('prose-case', className)}>
      <Markdown options={{ overrides: { Stats, a: ExternalLink } }}>
        {children}
      </Markdown>
    </div>
  )
}

export function InlineMarkdown({ children }: { children: string }) {
  return <Markdown options={{ forceInline: true }}>{children}</Markdown>
}
