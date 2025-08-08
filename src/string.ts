import { PREFIX } from './constants'

export const replaceSpecialCharBySpace = (str: string) =>
    str.replace(/[-_'`"()[\]]/g, ' ')

export const slugify = (s: string) =>
    replaceSpecialCharBySpace(s).trim().replace(/\s+/g, '-') // Replace spaces with dashes

export const formatRawListName = (rawDocName = '') =>
    decodeURIComponent(rawDocName.split(`${PREFIX}:`)[1])
