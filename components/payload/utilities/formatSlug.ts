import { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    // if (operation === 'create') {
    //   const fallbackData = data?.[fallback] || originalDoc?.[fallback]

    //   if (fallbackData && typeof fallbackData === 'string') {
    //     return format(fallbackData)
    //   }
    // }

    // return value
    const fallbackData = data?.[fallback] || originalDoc?.[fallback]

    if (fallbackData && typeof fallbackData === 'string') {
      return format(fallbackData)
    }
  }

export default formatSlug
