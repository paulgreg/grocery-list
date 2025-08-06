export const replaceSpecialCharBySpace = (str: string) =>
    str.replace(/[-_'`"()[\]]/g, ' ')

export const slugify = (s: string) =>
    replaceSpecialCharBySpace(s).trim().replace(/\s+/g, '-') // Replace spaces with dashes
