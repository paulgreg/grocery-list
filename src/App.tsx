import './App.css'
import { useCallback, useEffect, useState } from 'react'
import Home from './components/Home'
import List from './components/List'
import { GroceryItems } from './types'
import { debounce, slugify } from './utils'
import { PREFIX } from './constants'
import settings from './settings.json'

const DEBOUNCE_SAVE_TIME = 1000

const App = () => {
    const [listName, setListName] = useState('')
    const [list, setList] = useState<GroceryItems | null>(null)
    const slugListName = slugify(listName ?? '')

    const loadOnlineList = useCallback(
        async (slugName: string) => {
            if (!settings.saveOnline || !navigator.onLine) return
            try {
                const key = `${PREFIX}-${slugName}`
                const response = await fetch(
                    `${settings.saveUrl}/${key}.json`,
                    {
                        headers: {
                            Authorization: `Basic ${settings.authorization}`,
                        },
                    }
                )
                const data = response.ok ? await response.json() : []
                setList(data)
            } catch (e) {
                console.error(e)
                alert('error while loading data')
            }
        },
        [setList]
    )

    const saveOnlineList = useCallback(
        debounce((slugListName: string, data: GroceryItems) => {
            if (!settings.saveOnline || !navigator.onLine) return

            const key = `${PREFIX}-${slugListName}`
            return fetch(`${settings.saveUrl}/${key}.json`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        }, DEBOUNCE_SAVE_TIME),
        []
    )

    useEffect(() => {
        if (list && list.length > 0) {
            localStorage.setItem(
                `${PREFIX}-${slugListName}`,
                JSON.stringify(list)
            )
            saveOnlineList(slugListName, list)
        }
    }, [slugListName, list])

    const onSubmitListName = useCallback(
        (name: string) => {
            setListName(name)
        },
        [setListName]
    )

    useEffect(() => {
        if (listName?.length > 0) {
            setList(
                JSON.parse(
                    localStorage.getItem(`${PREFIX}-${slugListName}`) ?? '[]'
                )
            )
            loadOnlineList(slugListName)
        }
    }, [listName, slugListName])

    if (list) {
        return <List listName={listName} list={list} setList={setList} />
    }

    return <Home onSubmitListName={onSubmitListName} />
}

export default App
