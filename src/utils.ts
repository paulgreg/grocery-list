import { GroceryItem } from './types'

type DebounceFunction<T extends (...args: any[]) => any> = (
    ...args: Parameters<T>
) => void

export const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): DebounceFunction<T> => {
    let timerId: ReturnType<typeof setTimeout>

    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timerId)

        timerId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

export const slugify = (s: string) =>
    s
        .trim()
        .replace(/[^\w\s]/g, '') // Replace non-alphanumeric characters with empty string
        .replace(/\s+/g, '-') // Replace spaces with dashes

export const generateShortUID = () => {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 10)
    const uid = `${timestamp}${random}`
    return uid
}
export const sortList = (a: GroceryItem, b: GroceryItem) => {
    if (a.checked && !b.checked) return 1
    if (!a.checked && b.checked) return -1
    return a.color.localeCompare(b.color)
}
