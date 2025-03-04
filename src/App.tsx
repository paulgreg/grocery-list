import './App.css'
import { useCallback, useEffect, useState } from 'react'
import Home from './components/Home'
import List from './components/List'
import { GroceryItems } from './types'
import { debounce, slugify } from './utils'
import { PREFIX } from './constants'
import settings from './settings.json'
import * as jsonpatch from 'fast-json-patch'

const DEBOUNCE_SAVE_TIME = 1000

const App = () => {
    const [listName, setListName] = useState('')
    const [list, setList] = useState<GroceryItems | null>(null)
    const [newDoc, setNewDoc] = useState(true)
    const [previousList, setPreviousList] = useState<GroceryItems | null>(null)
    const slugListName = slugify(listName ?? '')

    const loadOnlineList = useCallback(async (slugName: string) => {
        if (!settings.saveOnline || !navigator.onLine) return
        try {
            const key = `${PREFIX}-${slugName}`
            const response = await fetch(`${settings.saveUrl}/${key}.json`, {
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                },
            })
            if (response.ok) {
                setNewDoc(false)
                return await response.json()
            }
            return []
        } catch (e) {
            console.error(e)
            alert('error while loading data')
        }
    }, [])

    const saveOnlineList = useCallback(
        debounce(
            (
                slugListName: string,
                data: GroceryItems,
                previousData: GroceryItems | null,
                newDoc: boolean
            ) => {
                if (!settings.saveOnline || !navigator.onLine) return

                const key = `${PREFIX}-${slugListName}`

                let method
                let bodyRaw
                if (!newDoc && previousData) {
                    method = 'PATCH'
                    bodyRaw = jsonpatch.compare(previousData, data)
                } else {
                    method = 'POST'
                    bodyRaw = data
                }

                return fetch(`${settings.saveUrl}/${key}.json`, {
                    method,
                    mode: 'cors',
                    headers: {
                        Authorization: `Basic ${settings.authorization}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyRaw),
                }).then(() => {
                    setPreviousList(data)
                    setNewDoc(false)
                })
            },
            DEBOUNCE_SAVE_TIME
        ),
        []
    )

    const setListAndPersist = useCallback(
        (list: GroceryItems) => {
            setList(list)
            localStorage.setItem(
                `${PREFIX}-${slugListName}`,
                JSON.stringify(list)
            )
            saveOnlineList(slugListName, list, previousList, newDoc)
        },
        [slugListName, previousList, newDoc]
    )

    const onSubmitListName = useCallback(
        (name: string) => {
            setListName(name)
        },
        [setListName]
    )

    useEffect(() => {
        const load = async () => {
            const serverList = await loadOnlineList(slugListName)
            const localList = JSON.parse(
                localStorage.getItem(`${PREFIX}-${slugListName}`) ?? '[]'
            )
            setList(serverList ?? localList)
            setPreviousList(serverList)
        }
        if (listName?.length > 0) load()
    }, [listName, slugListName])

    if (list) {
        return (
            <List listName={listName} list={list} setList={setListAndPersist} />
        )
    }

    return <Home onSubmitListName={onSubmitListName} />
}

export default App
