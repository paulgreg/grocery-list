import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Y from 'yjs'
import { PREFIX } from './constants'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'
import settings from './settings.json'
import { GroceryItem, GroceryItems } from './types'
import { useY } from 'react-yjs'
import { sortList } from './utils'
import { DataContext } from './DataContext'

interface DataContextProviderPropsType {
    listName: string
    children: React.ReactNode | React.ReactNode[]
}

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({
    listName,
    children,
}) => {
    const guid = `${PREFIX}:${listName}`

    const yDoc = useMemo(() => new Y.Doc({ guid }), [guid])
    const yItems = yDoc.getArray<Y.Map<string | boolean>>(`items`)

    const items = useY(yItems) as unknown as GroceryItems
    const sortedItems = items.toSorted(sortList)

    const persistence = useRef<IndexeddbPersistence>(null)
    const provider = useRef<WebsocketProvider>(null)

    useEffect(() => {
        persistence.current = new IndexeddbPersistence(guid, yDoc)
        if (settings.saveOnline && settings.wsUrl) {
            provider.current = new WebsocketProvider(settings.wsUrl, guid, yDoc)
            return () => provider.current?.disconnect()
        }
    }, [guid, yDoc])

    const addItem = useCallback(
        (item: GroceryItem) => {
            const { id, name, color, checked } = item
            const yItem = new Y.Map<string | boolean>()
            yItem.set('id', id)
            yItem.set('name', name)
            yItem.set('color', color)
            yItem.set('checked', checked)
            yItems.insert(0, [yItem])
        },
        [yItems]
    )

    const updateItem = useCallback(
        (id: string, name: string, color: string) => {
            const idx = yItems.toArray().findIndex((i) => i.get('id') === id)
            if (idx === -1) return
            const yItem = yItems.get(idx)
            yDoc.transact(() => {
                yItem.set('name', name)
                yItem.set('color', color)
            })
        },
        [yDoc, yItems]
    )

    const checkItem = useCallback(
        (id: string) => {
            const idx = yItems.toArray().findIndex((i) => i.get('id') === id)
            if (idx === -1) return
            const yItem = yItems.get(idx)
            yItem.set('checked', !yItem.get('checked'))
        },
        [yItems]
    )

    const deleteItem = useCallback(
        (id: string) => {
            const idx = yItems.toArray().findIndex((i) => i.get('id') === id)
            if (idx === -1) return
            yItems.delete(idx, 1)
        },
        [yItems]
    )

    const uncheckAllItems = useCallback(() => {
        yDoc.transact(() => {
            yItems.forEach((yItem) => {
                yItem.set('checked', false)
            })
        })
    }, [yDoc, yItems])

    const contextValue = useMemo(
        () => ({
            guid,
            items: sortedItems,
            addItem,
            updateItem,
            deleteItem,
            checkItem,
            uncheckAllItems,
        }),
        [
            guid,
            sortedItems,
            addItem,
            updateItem,
            deleteItem,
            checkItem,
            uncheckAllItems,
        ]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
