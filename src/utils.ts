import { GroceryItem } from './types'

export const slugify = (s: string) =>
    s
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^\w\s]/g, '') // Replace non-alphanumeric characters with empty string
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .trim()

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
