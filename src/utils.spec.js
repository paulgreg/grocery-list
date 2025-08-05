import { slugify } from './utils'

describe('utils', () => {
    describe('slugify', () => {
        test('should remove space', () => expect(slugify('a a')).toEqual('a-a'))

        test('should keep accent', () =>
            expect(slugify('marché')).toEqual('marché'))

        test('should keep uppercase', () =>
            expect(slugify('Test')).toEqual('Test'))
    })
})
